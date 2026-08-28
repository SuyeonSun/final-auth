package com.finalauth.backend.auth;

import com.finalauth.backend.auth.dto.AccessTokenData;
import com.finalauth.backend.auth.dto.LoginRequest;
import com.finalauth.backend.auth.dto.LoginResponseData;
import com.finalauth.backend.auth.dto.LogoutRequest;
import com.finalauth.backend.auth.dto.RefreshRequest;
import com.finalauth.backend.auth.dto.RegisterRequest;
import com.finalauth.backend.auth.dto.TokenPair;
import com.finalauth.backend.auth.jwt.JwtTokenProvider;
import com.finalauth.backend.common.ApiException;
import com.finalauth.backend.user.User;
import com.finalauth.backend.user.UserDto;
import com.finalauth.backend.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class AuthService {

	private static final Logger log = LoggerFactory.getLogger(AuthService.class);

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtTokenProvider jwtTokenProvider;
	private final RefreshTokenService refreshTokenService;

	public AuthService(
			UserRepository userRepository,
			PasswordEncoder passwordEncoder,
			JwtTokenProvider jwtTokenProvider,
			RefreshTokenService refreshTokenService
	) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtTokenProvider = jwtTokenProvider;
		this.refreshTokenService = refreshTokenService;
	}

	@Transactional
	public UserDto register(RegisterRequest request) {
		if (userRepository.existsByUseremail(request.useremail())) {
			throw new ApiException(HttpStatus.CONFLICT, "AUTH_EMAIL_ALREADY_EXISTS", "이미 사용 중인 이메일입니다.");
		}

		User user = new User(
				request.useremail(),
				request.username(),
				passwordEncoder.encode(request.password()),
				List.of("user")
		);
		userRepository.save(user);

		return UserDto.from(user);
	}

	@Transactional
	public LoginResponseData login(LoginRequest request) {
		User user = userRepository.findByUseremail(request.useremail())
				.orElseThrow(() -> new ApiException(
						HttpStatus.UNAUTHORIZED, "AUTH_INVALID_CREDENTIALS", "이메일 또는 비밀번호가 올바르지 않습니다."));

		if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
			throw new ApiException(
					HttpStatus.UNAUTHORIZED, "AUTH_INVALID_CREDENTIALS", "이메일 또는 비밀번호가 올바르지 않습니다.");
		}

		JwtTokenProvider.GeneratedAccessToken accessToken = jwtTokenProvider.generateAccessToken(user);
		RefreshTokenService.IssuedRefreshToken refreshToken = refreshTokenService.issue(user);

		TokenPair tokens = new TokenPair(
				accessToken.token(),
				formatInstant(accessToken.expiresAt()),
				refreshToken.rawToken(),
				formatInstant(refreshToken.expiresAt())
		);

		return new LoginResponseData(tokens, UserDto.from(user));
	}

	@Transactional
	public AccessTokenData refresh(RefreshRequest request) {
		RefreshToken refreshToken = refreshTokenService.findByRawToken(request.refreshToken())
				.orElseThrow(() -> new ApiException(
						HttpStatus.UNAUTHORIZED, "AUTH_REFRESH_TOKEN_INVALID", "로그인이 필요합니다."));

		if (!refreshToken.isUsable()) {
			throw new ApiException(HttpStatus.UNAUTHORIZED, "AUTH_REFRESH_TOKEN_EXPIRED", "다시 로그인해 주세요.");
		}

		User user = refreshToken.getUser();
		JwtTokenProvider.GeneratedAccessToken accessToken = jwtTokenProvider.generateAccessToken(user);

		log.info("Access token reissued via refresh token: userId={}, useremail={}, expiresAt={}",
				user.getId(), user.getUseremail(), accessToken.expiresAt());

		return new AccessTokenData(accessToken.token(), formatInstant(accessToken.expiresAt()));
	}

	@Transactional
	public void logout(LogoutRequest request) {
		refreshTokenService.revoke(request.refreshToken());
	}

	private String formatInstant(Instant instant) {
		return DateTimeFormatter.ISO_INSTANT.format(instant);
	}
}

package com.finalauth.backend.auth;

import com.finalauth.backend.auth.dto.AccessTokenData;
import com.finalauth.backend.auth.dto.LoginRequest;
import com.finalauth.backend.auth.dto.LoginResponseData;
import com.finalauth.backend.auth.dto.LogoutRequest;
import com.finalauth.backend.auth.dto.RefreshRequest;
import com.finalauth.backend.auth.dto.RefreshResponseData;
import com.finalauth.backend.auth.dto.RegisterRequest;
import com.finalauth.backend.auth.dto.RegisterResponseData;
import com.finalauth.backend.common.ApiResponse;
import com.finalauth.backend.user.UserDto;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthService authService;

	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping(value = "/register", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<ApiResponse<RegisterResponseData>> register(@Valid @RequestBody RegisterRequest request) {
		UserDto user = authService.register(request);

		return ResponseEntity.status(HttpStatus.CREATED)
				.header("Cache-Control", "no-store")
				.body(ApiResponse.of("AUTH_REGISTER_SUCCESS", "회원가입되었습니다.", new RegisterResponseData(user)));
	}

	@PostMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<ApiResponse<LoginResponseData>> login(@Valid @RequestBody LoginRequest request) {
		LoginResponseData data = authService.login(request);

		return ResponseEntity.ok()
				.header("Cache-Control", "no-store")
				.body(ApiResponse.of("AUTH_LOGIN_SUCCESS", "로그인되었습니다.", data));
	}

	@PostMapping(value = "/refresh", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<ApiResponse<RefreshResponseData>> refresh(@Valid @RequestBody RefreshRequest request) {
		AccessTokenData token = authService.refresh(request);

		return ResponseEntity.ok()
				.header("Cache-Control", "no-store")
				.body(ApiResponse.of("AUTH_TOKEN_REFRESH_SUCCESS", "토큰이 갱신되었습니다.", new RefreshResponseData(token)));
	}

	@PostMapping(value = "/logout", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<ApiResponse<Void>> logout(@Valid @RequestBody LogoutRequest request) {
		authService.logout(request);

		return ResponseEntity.ok()
				.header("Cache-Control", "no-store")
				.body(ApiResponse.of("AUTH_LOGOUT_SUCCESS", "로그아웃되었습니다.", null));
	}
}

package com.finalauth.backend.auth;

import com.finalauth.backend.user.User;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Optional;

@Service
public class RefreshTokenService {

	private final SecureRandom secureRandom = new SecureRandom();
	private final RefreshTokenRepository refreshTokenRepository;
	private final RefreshTokenProperties properties;

	public RefreshTokenService(RefreshTokenRepository refreshTokenRepository, RefreshTokenProperties properties) {
		this.refreshTokenRepository = refreshTokenRepository;
		this.properties = properties;
	}

	public IssuedRefreshToken issue(User user) {
		byte[] randomBytes = new byte[32];
		secureRandom.nextBytes(randomBytes);
		String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
		Instant expiresAt = Instant.now().plus(properties.expirationSeconds(), ChronoUnit.SECONDS);

		refreshTokenRepository.save(new RefreshToken(hash(rawToken), user, expiresAt));

		return new IssuedRefreshToken(rawToken, expiresAt);
	}

	public Optional<RefreshToken> findByRawToken(String rawToken) {
		return refreshTokenRepository.findByTokenHash(hash(rawToken));
	}

	public void revoke(String rawToken) {
		refreshTokenRepository.findByTokenHash(hash(rawToken))
				.ifPresent(token -> {
					token.setRevoked(true);
					refreshTokenRepository.save(token);
				});
	}

	private String hash(String rawToken) {
		try {
			MessageDigest digest = MessageDigest.getInstance("SHA-256");
			byte[] hashed = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));

			return Base64.getEncoder().encodeToString(hashed);
		} catch (NoSuchAlgorithmException ex) {
			throw new IllegalStateException(ex);
		}
	}

	public record IssuedRefreshToken(String rawToken, Instant expiresAt) {
	}
}

package com.finalauth.backend.auth.jwt;

import com.finalauth.backend.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Component
public class JwtTokenProvider {

	private final SecretKey key;
	private final long accessTokenExpirationSeconds;

	public JwtTokenProvider(JwtProperties properties) {
		this.key = Keys.hmacShaKeyFor(properties.secret().getBytes(StandardCharsets.UTF_8));
		this.accessTokenExpirationSeconds = properties.accessTokenExpirationSeconds();
	}

	public GeneratedAccessToken generateAccessToken(User user) {
		Instant now = Instant.now();
		Instant expiresAt = now.plus(accessTokenExpirationSeconds, ChronoUnit.SECONDS);

		String token = Jwts.builder()
				.subject(user.getId())
				.claim("useremail", user.getUseremail())
				.claim("roles", user.getRoles())
				.issuedAt(Date.from(now))
				.expiration(Date.from(expiresAt))
				.signWith(key)
				.compact();

		return new GeneratedAccessToken(token, expiresAt);
	}

	public String parseUserId(String token) {
		Claims claims = Jwts.parser()
				.verifyWith(key)
				.build()
				.parseSignedClaims(token)
				.getPayload();

		return claims.getSubject();
	}

	public TokenStatus validate(String token) {
		try {
			Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
			return TokenStatus.VALID;
		} catch (ExpiredJwtException ex) {
			return TokenStatus.EXPIRED;
		} catch (JwtException | IllegalArgumentException ex) {
			return TokenStatus.INVALID;
		}
	}

	public record GeneratedAccessToken(String token, Instant expiresAt) {
	}

	public enum TokenStatus {
		VALID,
		EXPIRED,
		INVALID
	}
}

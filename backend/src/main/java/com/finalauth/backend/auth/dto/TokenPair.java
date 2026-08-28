package com.finalauth.backend.auth.dto;

public record TokenPair(
		String accessToken,
		String accessTokenExpiresAt,
		String refreshToken,
		String refreshTokenExpiresAt
) {
}

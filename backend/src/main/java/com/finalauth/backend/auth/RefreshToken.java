package com.finalauth.backend.auth;

import com.finalauth.backend.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "refresh_tokens")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RefreshToken {

	@Id
	private String id;

	@Column(nullable = false, unique = true)
	private String tokenHash;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(nullable = false)
	private Instant expiresAt;

	@Setter
	@Column(nullable = false)
	private boolean revoked;

	public RefreshToken(String tokenHash, User user, Instant expiresAt) {
		this.id = UUID.randomUUID().toString();
		this.tokenHash = tokenHash;
		this.user = user;
		this.expiresAt = expiresAt;
		this.revoked = false;
	}

	public boolean isUsable() {
		return !revoked && expiresAt.isAfter(Instant.now());
	}
}

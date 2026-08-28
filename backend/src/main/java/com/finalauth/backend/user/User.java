package com.finalauth.backend.user;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

	@Id
	private String id;

	@Column(nullable = false, unique = true)
	private String useremail;

	@Column(nullable = false)
	private String username;

	@Column(nullable = false)
	private String passwordHash;

	@ElementCollection(fetch = FetchType.EAGER)
	@CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
	@Column(name = "role")
	private List<String> roles = new ArrayList<>();

	public User(String useremail, String username, String passwordHash, List<String> roles) {
		this.id = UUID.randomUUID().toString();
		this.useremail = useremail;
		this.username = username;
		this.passwordHash = passwordHash;
		this.roles = new ArrayList<>(roles);
	}
}

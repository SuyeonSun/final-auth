package com.finalauth.backend.ev;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "ev_charging_companies")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EvChargingCompany {

	public enum Status {
		ACTIVE,
		INACTIVE
	}

	@Id
	private String id;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	private int chargerCount;

	@Column(nullable = false)
	private String region;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Status status;

	public EvChargingCompany(String name, int chargerCount, String region, Status status) {
		this.id = UUID.randomUUID().toString();
		this.name = name;
		this.chargerCount = chargerCount;
		this.region = region;
		this.status = status;
	}
}

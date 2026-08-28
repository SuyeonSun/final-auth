package com.finalauth.backend.ev;

public record EvChargingCompanyDto(String id, String name, int chargerCount, String region, String status) {

	public static EvChargingCompanyDto from(EvChargingCompany company) {
		return new EvChargingCompanyDto(
				company.getId(),
				company.getName(),
				company.getChargerCount(),
				company.getRegion(),
				company.getStatus().name()
		);
	}
}

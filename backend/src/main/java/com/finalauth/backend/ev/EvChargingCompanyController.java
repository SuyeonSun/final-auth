package com.finalauth.backend.ev;

import com.finalauth.backend.common.ApiResponse;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ev")
public class EvChargingCompanyController {

	private final EvChargingCompanyRepository repository;

	public EvChargingCompanyController(EvChargingCompanyRepository repository) {
		this.repository = repository;
	}

	@GetMapping(value = "/companies", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<ApiResponse<List<EvChargingCompanyDto>>> companies() {
		List<EvChargingCompanyDto> data = repository.findAll().stream()
				.map(EvChargingCompanyDto::from)
				.toList();

		return ResponseEntity.ok()
				.header("Cache-Control", "private, no-store")
				.body(ApiResponse.of("EV_COMPANY_LIST_SUCCESS", "충전기 회사 목록을 조회했습니다.", data));
	}
}

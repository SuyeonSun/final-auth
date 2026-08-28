package com.finalauth.backend.config;

import com.finalauth.backend.ev.EvChargingCompany;
import com.finalauth.backend.ev.EvChargingCompanyRepository;
import com.finalauth.backend.user.User;
import com.finalauth.backend.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final EvChargingCompanyRepository evChargingCompanyRepository;

	public DataSeeder(
			UserRepository userRepository,
			PasswordEncoder passwordEncoder,
			EvChargingCompanyRepository evChargingCompanyRepository
	) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.evChargingCompanyRepository = evChargingCompanyRepository;
	}

	@Override
	public void run(String... args) {
		if (userRepository.count() == 0) {
			userRepository.save(new User(
					"demo@example.com",
					"데모 사용자",
					passwordEncoder.encode("password123"),
					List.of("user")
			));
		}

		if (evChargingCompanyRepository.count() == 0) {
			evChargingCompanyRepository.saveAll(List.of(
					new EvChargingCompany("차지비", 120, "서울", EvChargingCompany.Status.ACTIVE),
					new EvChargingCompany("이비고", 85, "경기", EvChargingCompany.Status.ACTIVE),
					new EvChargingCompany("환경부 급속충전", 40, "부산", EvChargingCompany.Status.INACTIVE),
					new EvChargingCompany("GS차지비", 210, "인천", EvChargingCompany.Status.ACTIVE)
			));
		}
	}
}

package com.finalauth.backend.user;

import com.finalauth.backend.common.ApiException;
import com.finalauth.backend.common.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

	private final UserRepository userRepository;

	public UserController(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@GetMapping(value = "/me", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<ApiResponse<UserDto>> me(Authentication authentication) {
		String userId = (String) authentication.getPrincipal();
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "AUTH_ACCESS_TOKEN_INVALID", "인증이 필요합니다."));

		return ResponseEntity.ok()
				.header("Cache-Control", "private, no-store")
				.body(ApiResponse.of("USER_ME_SUCCESS", "사용자 정보를 조회했습니다.", UserDto.from(user)));
	}
}

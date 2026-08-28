package com.finalauth.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
		@NotBlank(message = "이름을 입력해 주세요.")
		@Size(min = 2, max = 30, message = "이름은 2자 이상 30자 이하로 입력해 주세요.")
		String username,

		@NotBlank(message = "이메일을 입력해 주세요.")
		@Email(message = "올바른 이메일 형식이 아닙니다.")
		String useremail,

		@NotBlank(message = "비밀번호를 입력해 주세요.")
		@Size(min = 8, max = 72, message = "비밀번호는 8자 이상 72자 이하로 입력해 주세요.")
		String password
) {
}

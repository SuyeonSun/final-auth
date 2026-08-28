package com.finalauth.backend.common;

public record ApiResponse<T>(String code, String message, T data) {

	public static <T> ApiResponse<T> of(String code, String message, T data) {
		return new ApiResponse<>(code, message, data);
	}
}

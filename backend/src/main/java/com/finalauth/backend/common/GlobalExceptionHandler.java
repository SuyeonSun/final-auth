package com.finalauth.backend.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

	private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	@ExceptionHandler(ApiException.class)
	public ResponseEntity<ApiResponse<Object>> handleApiException(ApiException ex) {
		return ResponseEntity.status(ex.getStatus())
				.body(ApiResponse.of(ex.getCode(), ex.getMessage(), null));
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiResponse<ValidationErrorData>> handleValidation(MethodArgumentNotValidException ex) {
		Map<String, List<String>> fieldErrors = new LinkedHashMap<>();

		for (FieldError error : ex.getBindingResult().getFieldErrors()) {
			fieldErrors
					.computeIfAbsent(error.getField(), key -> new ArrayList<>())
					.add(error.getDefaultMessage());
		}

		return ResponseEntity.badRequest()
				.body(ApiResponse.of("AUTH_VALIDATION_FAILED", "입력값을 확인해 주세요.", new ValidationErrorData(fieldErrors)));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiResponse<Object>> handleUnexpected(Exception ex) {
		log.error("Unhandled exception", ex);

		return ResponseEntity.internalServerError()
				.body(ApiResponse.of("INTERNAL_SERVER_ERROR", "서버 오류가 발생했습니다.", null));
	}
}

package com.finalauth.backend.auth.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.finalauth.backend.common.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

	private final ObjectMapper objectMapper;

	public RestAuthenticationEntryPoint(ObjectMapper objectMapper) {
		this.objectMapper = objectMapper;
	}

	@Override
	public void commence(
			HttpServletRequest request,
			HttpServletResponse response,
			AuthenticationException authException
	) throws IOException {
		boolean expired = request.getAttribute(JwtAuthenticationFilter.TOKEN_STATUS_ATTRIBUTE)
				== JwtTokenProvider.TokenStatus.EXPIRED;

		String code = expired ? "AUTH_ACCESS_TOKEN_EXPIRED" : "AUTH_ACCESS_TOKEN_INVALID";
		String message = expired ? "액세스 토큰이 만료되었습니다." : "인증이 필요합니다.";

		response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(objectMapper.writeValueAsString(
				ApiResponse.of(code, message, null)));
	}
}

package com.finalauth.backend.auth.jwt;

import com.finalauth.backend.user.User;
import com.finalauth.backend.user.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

	public static final String TOKEN_STATUS_ATTRIBUTE = "com.finalauth.backend.auth.jwt.tokenStatus";

	private final JwtTokenProvider jwtTokenProvider;
	private final UserRepository userRepository;

	public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider, UserRepository userRepository) {
		this.jwtTokenProvider = jwtTokenProvider;
		this.userRepository = userRepository;
	}

	@Override
	protected void doFilterInternal(
			@NonNull HttpServletRequest request,
			@NonNull HttpServletResponse response,
			@NonNull FilterChain filterChain
	) throws ServletException, IOException {
		String token = resolveToken(request);

		if (token != null) {
			JwtTokenProvider.TokenStatus status = jwtTokenProvider.validate(token);
			request.setAttribute(TOKEN_STATUS_ATTRIBUTE, status);

			if (status == JwtTokenProvider.TokenStatus.VALID) {
				String userId = jwtTokenProvider.parseUserId(token);
				Optional<User> user = userRepository.findById(userId);

				user.ifPresent(value -> {
					List<GrantedAuthority> authorities = value.getRoles().stream()
							.map(role -> (GrantedAuthority) new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
							.toList();

					UsernamePasswordAuthenticationToken authentication =
							new UsernamePasswordAuthenticationToken(value.getId(), null, authorities);
					SecurityContextHolder.getContext().setAuthentication(authentication);
				});
			}
		}

		filterChain.doFilter(request, response);
	}

	private String resolveToken(HttpServletRequest request) {
		String header = request.getHeader("Authorization");

		if (header != null && header.startsWith("Bearer ")) {
			return header.substring(7);
		}

		return null;
	}
}

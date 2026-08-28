package com.finalauth.backend.config;

import com.finalauth.backend.auth.jwt.JwtAuthenticationFilter;
import com.finalauth.backend.auth.jwt.JwtTokenProvider;
import com.finalauth.backend.auth.jwt.RestAccessDeniedHandler;
import com.finalauth.backend.auth.jwt.RestAuthenticationEntryPoint;
import com.finalauth.backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource(
			@Value("${app.cors.allowed-origins}") String allowedOrigins
	) {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
		configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
		configuration.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);

		return source;
	}

	@Bean
	public SecurityFilterChain securityFilterChain(
			HttpSecurity http,
			JwtTokenProvider jwtTokenProvider,
			UserRepository userRepository,
			RestAuthenticationEntryPoint authenticationEntryPoint,
			RestAccessDeniedHandler accessDeniedHandler,
			CorsConfigurationSource corsConfigurationSource
	) throws Exception {
		http
				.cors(cors -> cors.configurationSource(corsConfigurationSource))
				.csrf(csrf -> csrf.disable())
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.exceptionHandling(handling -> handling
						.authenticationEntryPoint(authenticationEntryPoint)
						.accessDeniedHandler(accessDeniedHandler))
				.authorizeHttpRequests(authorize -> authorize
						.requestMatchers("/api/auth/**").permitAll()
						.requestMatchers("/h2-console/**").permitAll()
						.anyRequest().authenticated())
				.headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
				.addFilterBefore(
						new JwtAuthenticationFilter(jwtTokenProvider, userRepository),
						UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}
}

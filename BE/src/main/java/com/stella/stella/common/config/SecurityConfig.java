package com.stella.stella.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.stella.stella.common.Jwt.JwtAuthenticationFilter;
import com.stella.stella.common.Jwt.JwtTokenProvider;
import com.stella.stella.member.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private final JwtTokenProvider jwtTokenProvider;
	private final MemberRepository memberRepository;
	private final AuthenticationManagerBuilder authenticationManagerBuilder;

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
				.authorizeRequests(authorizeRequests ->
						authorizeRequests
								.requestMatchers("/api/member/login/**").permitAll()
								.requestMatchers("/api/member/join/**").permitAll()
								.requestMatchers("/api/member/join/").permitAll()
								.requestMatchers("/api/follow/**").permitAll()
								.requestMatchers("/api/member/dup-check/**").permitAll()
								.requestMatchers("/api/member/test").hasRole("USER")
								.requestMatchers("/api/member/check/email").permitAll()
								.requestMatchers("/api/member/find/**").permitAll()
								.requestMatchers("/api/member/ban").hasRole("ADMIN")
								.requestMatchers("/api/member/search/list").permitAll()
								.requestMatchers("/api/member/delete").permitAll()
								.requestMatchers("/api/alarm/**").permitAll()
								.requestMatchers("/api/board/**").permitAll()
                                .requestMatchers("/api/comment/**").permitAll()
                                .requestMatchers("/api/multicomment/**").permitAll()
								.requestMatchers("/api/radio/**").permitAll()
								.requestMatchers("/api/search/**").permitAll()
//                				.requestMatchers("/member/test").hasAnyRole("USER","ADMIN")
								.requestMatchers("/api/media/**").permitAll()
								.requestMatchers("/api/opinion/**").permitAll()
								.anyRequest().authenticated()

				)
				.addFilterBefore(
						new JwtAuthenticationFilter(jwtTokenProvider, memberRepository, authenticationManagerBuilder),
						UsernamePasswordAuthenticationFilter.class)
				.csrf().disable()
				.headers().frameOptions().disable()
				.and()
				.cors(); // CORS 활성화

//		http.httpBasic().disable().csrf().disable().sessionManagement()
//				.sessionCreationPolicy(SessionCreationPolicy.STATELESS).and().authorizeRequests()
//				.requestMatchers("/member/login/**").permitAll()
//				.requestMatchers("/member/join/**").permitAll()
//				.requestMatchers("/follow/**").permitAll()
//				.requestMatchers("/member/dup-check/**").permitAll()
//				.requestMatchers("/member/test").hasRole("USER")
//				.requestMatchers("/member/check/email").permitAll()
//				.requestMatchers("/member/find/**").permitAll()
//				.requestMatchers("/member/ban").hasRole("ADMIN")
//				.requestMatchers("/member/search/list").permitAll()
////            .requestMatchers("/member/test").hasAnyRole("USER","ADMIN")
//				.anyRequest().authenticated().and().addFilterBefore(
//						new JwtAuthenticationFilter(jwtTokenProvider, memberRepository, authenticationManagerBuilder),
//						UsernamePasswordAuthenticationFilter.class)
//				.cors();
		return http.build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return PasswordEncoderFactories.createDelegatingPasswordEncoder();
	}
}
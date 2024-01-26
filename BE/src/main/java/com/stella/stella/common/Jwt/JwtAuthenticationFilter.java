package com.stella.stella.common.Jwt;

import java.io.IOException;
import java.util.Date;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.stella.stella.member.entity.Member;
import com.stella.stella.member.repository.MemberRepository;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtTokenProvider jwtTokenProvider;
	private final MemberRepository memberRepository;
	private final AuthenticationManagerBuilder authenticationManagerBuilder;

	@Override
	public void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		// 1. Request Header 에서 JWT 토큰 추출
		String token = resolveToken(request);

		// 2. validateToken 으로 토큰 유효성 검사
		if (token != null && jwtTokenProvider.validateToken(token)) {
			Claims claims = jwtTokenProvider.parseClaims(token);
			// 토큰 유효기간은 남아있고 갱신 시점은 지난 상태
			if ((new Date()).getTime() > (Long) claims.get("refresh")) {
				log.info("shoud refresh");
				Long aceessMemberIndex = Long.parseLong(claims.get("sub").toString());
				// 토큰에서 얻은 인덱스로 해당 멤버 정보 가져옴
				Member accessMember = memberRepository.findByMemberIndex(aceessMemberIndex)
						.orElseThrow(() -> new UsernameNotFoundException("해당하는 유저를 찾을 수 없습니다."));
				// 해당 멤버의 리프레쉬 토큰 유효성 확인
				if (jwtTokenProvider.validateToken(accessMember.getMemberRefreshToken())) {
					log.info("can refresh");
					//curMember 객체에서 가져온 정보로 멤버서비스의 Login 기능 실행
					UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
							accessMember.getMemberIndex(), accessMember.getMemberPass());
					
					Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
					
					TokenInfo newTokenInfo = jwtTokenProvider.generateToken(authentication);
					//accesstoken을 재발행된 토큰으로 설정
					token = newTokenInfo.getAccessToken();
					
					accessMember.setMemberRefreshToken(newTokenInfo.getRefreshToken());
				}
			}
			// 토큰이 유효할 경우 토큰에서 Authentication 객체를 가지고 와서 SecurityContext 에 저장
			Authentication authentication = jwtTokenProvider.getAuthentication(token);
			SecurityContextHolder.getContext().setAuthentication(authentication);
			request.setAttribute("accessMemberIndex", Long.parseLong(jwtTokenProvider.parseClaims(token).get("sub").toString()));
			request.setAttribute("accessMemberRole",jwtTokenProvider.parseClaims(token).get("auth").toString().substring(5));
			response.setHeader("accesstoken", token);
		}
		filterChain.doFilter(request, response);
	}

	// Request Header 에서 토큰 정보 추출
	private String resolveToken(HttpServletRequest request) {
		String bearerToken = request.getHeader("Authorization");
		if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer")) {
			return bearerToken.substring(7);
		}
		return null;
	}
}
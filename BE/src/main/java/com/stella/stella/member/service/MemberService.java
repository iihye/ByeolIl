package com.stella.stella.member.service;

import com.stella.stella.Jwt.JwtTokenProvider;
import com.stella.stella.Jwt.TokenInfo;
import com.stella.stella.member.dto.MemberJoinRequestDto;
import com.stella.stella.member.entity.Member;
import com.stella.stella.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

	private final MemberRepository memberRepository;
	private final AuthenticationManagerBuilder authenticationManagerBuilder;
	private final JwtTokenProvider jwtTokenProvider;

	@Value("${kakao.key}")
	private String kakaoRestAPIKey;

	@Transactional
	public String login(String memberId, String memberPassword, String memberPlatform) {

		// 0. memberId와 memeberPlatform으로 memberIndex(PK) 검색
		Member accessMember = memberRepository.findByMemberIdAndMemberPlatform(memberId, memberPlatform)
				.orElseThrow(() -> new UsernameNotFoundException("해당하는 유저를 찾을 수 없습니다."));

		log.info(accessMember.toString());
		// 1. Login Index/PW 를 기반으로 Authentication 객체 생성
		// 이때 authentication 는 인증 여부를 확인하는 authenticated 값이 false
		UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
				accessMember.getMemberIndex(), memberPassword);

		// 2. 실제 검증 (사용자 비밀번호 체크)이 이루어지는 부분
		// authenticate 매서드가 실행될 때 CustomUserDetailsService 에서 만든 loadUserByUsername 메서드
		// 실행
		Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

		// 3. 인증 정보를 기반으로 JWT 토큰 생성
		TokenInfo tokenInfo = jwtTokenProvider.generateToken(authentication);
		// 4. DB에 refreshToken 저장
		accessMember.setMemberRefreshToken(tokenInfo.getRefreshToken());
		return tokenInfo.getAccessToken();
	}

	public String getKakaoAccessToken(String code) {
		String REQUEST_URL = "https://kauth.kakao.com/oauth/token";
		RestTemplate restTemplate = new RestTemplate();

		// Set Header
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
		headers.add("Accept", "application/json");

		// Set parameter
		MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
		params.add("grant_type", "authorization_code");
		params.add("client_id", kakaoRestAPIKey);
		params.add("redirect_uri", "http://localhost:8080/member/login/kakao");
		params.add("code", code);
		// Set http entity
		HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
		//
		ResponseEntity<String> stringResponseEntity = restTemplate.postForEntity(REQUEST_URL, request, String.class);

		JSONObject jsonObject = new JSONObject(stringResponseEntity.getBody());

		return jsonObject.getString("access_token");
	}

	public HashMap<String, String> getKakaoMemberInfo(String kakaoAcessToken) {
		String postURL = "https://kapi.kakao.com/v2/user/me";

		RestTemplate restTemplate = new RestTemplate();

		// Set Header
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
		headers.add("Authorization", "Bearer " + kakaoAcessToken);

		MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
		// Set http entity
		HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

		ResponseEntity<String> stringResponseEntity = restTemplate.postForEntity(postURL, request, String.class);

		JSONObject jsonObject = new JSONObject(stringResponseEntity.getBody());

		HashMap<String, String> memberInfo = new HashMap<>();
		memberInfo.put("id", jsonObject.get("id").toString());
		memberInfo.put("nickname", ((JSONObject) jsonObject.get("properties")).getString("nickname"));

		JSONObject innerJsonObject = (JSONObject) jsonObject.get("kakao_account");
		try {
			memberInfo.put("email", innerJsonObject.getString("email"));
		} catch (JSONException e) {
			memberInfo.put("email", null);
		}
		try {
			memberInfo.put("birthday", innerJsonObject.getString("birthday"));
		} catch (JSONException e) {
			memberInfo.put("birthday", null);
		}

		return memberInfo;
	}

	public void join(MemberJoinRequestDto memberJoinDto) {
		Member newMember = memberJoinDto.toEntity();
		memberRepository.save(newMember);
	}
	//Member 엔티티를 전부 보내는 메소드: 컨트롤러에서 Dto로 변환 필요
	public Member info(long memberIndex) {
		return memberRepository.findByMemberIndex(memberIndex)
				.orElseThrow(() -> new UsernameNotFoundException("해당하는 유저를 찾을 수 없습니다."));
	}
}
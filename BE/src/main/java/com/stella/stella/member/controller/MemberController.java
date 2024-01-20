package com.stella.stella.member.controller;

import com.stella.stella.member.dto.MemberJoinRequestDto;
import com.stella.stella.member.dto.MemberLoginRequestDto;
import com.stella.stella.member.dto.MyInfoResponseDto;
import com.stella.stella.member.entity.Member;
import com.stella.stella.member.repository.MemberRepository;
import com.stella.stella.member.service.MemberService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/member")
public class MemberController {

	@Autowired
	MemberRepository memberRepository;

	private final MemberService memberService;

	@PostMapping("/login/origin")
	public ResponseEntity<Map<String, Object>> originLogin(@RequestBody MemberLoginRequestDto memberLoginRequestDto) {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = HttpStatus.OK;
		try {
			String accessToken = memberService.login(memberLoginRequestDto.getMemberId(),
					memberLoginRequestDto.getMemberPass(), memberLoginRequestDto.getMemberPlatform());
			resultMap.put("accessToken", accessToken);
		} catch (Exception e) {
			resultMap.put("message", e.getMessage());
			status = HttpStatus.BAD_REQUEST;
		}
		return ResponseEntity.status(status).body(resultMap);
	}

	@GetMapping("/login/kakao")
	public ResponseEntity<Map<String, Object>> kakaoLogin(@RequestParam("code") String code) {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = HttpStatus.OK;
		try {
			String kakaoAcessToken = memberService.getKakaoAccessToken(code);
			Map<String, String> kakaoMemberInfo = memberService.getKakaoMemberInfo(kakaoAcessToken);
			String accessToken = memberService.login(kakaoMemberInfo.get("id"), "", "kakao");
			resultMap.put("accessToken", accessToken);
		} catch (Exception e) {
			resultMap.put("message", e.getMessage());
			status = HttpStatus.BAD_REQUEST;
		}
		return ResponseEntity.status(status).body(resultMap);
	}

	@PostMapping("/join")
	public ResponseEntity<Map<String, Object>> originJoin(@RequestBody MemberJoinRequestDto memberJoinDto) {
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = HttpStatus.CREATED;
		try {
			memberService.join(memberJoinDto);
			resultMap.put("message", "success");
		} catch (Exception e) {
			resultMap.put("message", e.getMessage());
			status = HttpStatus.BAD_REQUEST;
		}
		return ResponseEntity.status(status).body(resultMap);
	}

	@GetMapping("/join/kakao")
	public HttpStatus kakaoJoin() {
		return HttpStatus.OK;
	}
	//본인 정보
	@GetMapping("/info/mine")
	public ResponseEntity<MyInfoResponseDto> myInfo(HttpServletRequest request) {
		Member result = null;
		HttpStatus status = HttpStatus.OK;
		try {
			Long accessMemberIndex = (Long)request.getAttribute("accessMemberIndex");
			log.info("accessMemberIndex={}",accessMemberIndex);
			result = memberService.info(accessMemberIndex);
			log.info("result={}",result);
		} catch(NullPointerException e) {
			status = HttpStatus.NOT_FOUND;
		} catch(Exception e) {
			status = HttpStatus.BAD_REQUEST;
		}
		return ResponseEntity.status(status).body(new MyInfoResponseDto(result));
	}
	
//	@GetMapping("/info")
//	public ResponseEntity<MemberInfoResponseDto> memberInfo(@RequestParam("index") long memberIndex,HttpServletRequest request) {
//		Member result = null;
//		HttpStatus status = HttpStatus.OK;
//		String accessToken = request.getHeader("accessToken");
//		try {
//			result = memberService.info(memberIndex);
//		} catch(NullPointerException e) {
//			status = HttpStatus.NOT_FOUND;
//		} catch(Exception e) {
//			status = HttpStatus.BAD_REQUEST;
//		}
//		return ResponseEntity.status(status).body(new MemberInfoResponseDto(result));
//	}

	@PostMapping("/test")
	public ResponseEntity<Map<String, Object>> getTestPage(HttpServletRequest request) {
		log.info("권한 실험 입력");
		log.info("request={}", request.getHeader("Authorization"));
		log.info("body={}", request.getParameterMap().toString());
		Map<String, Object> resultMap = new HashMap<String, Object>();
		resultMap.put("access-token", request.getHeader("Authorization"));
		return new ResponseEntity<Map<String, Object>>(resultMap, HttpStatus.ACCEPTED);
	}
}

package com.stella.stella.member.controller;

import com.stella.stella.common.email.EmailSender;
import com.stella.stella.member.dto.*;
import com.stella.stella.member.entity.Member;
import com.stella.stella.member.repository.MemberRepository;
import com.stella.stella.member.service.MemberService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")
public class MemberController {

    @Autowired
    private final MemberRepository memberRepository;
    private final MemberService memberService;

    //홈페이지 로그인
    @PostMapping("/login/origin")
    public ResponseEntity<Map<String, Object>> originLogin(@RequestBody MemberLoginRequestDto memberLoginRequestDto) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.OK;
        log.info("dto={}", memberLoginRequestDto);
        String accessToken = "";
        try {
            accessToken = memberService.login(memberLoginRequestDto.getMemberId(),
                    memberLoginRequestDto.getMemberPass(), memberLoginRequestDto.getMemberPlatform());
            resultMap.put("message", "success");
        } catch (Exception e) {
            resultMap.put("message", e.getMessage());
            status = HttpStatus.BAD_REQUEST;
        }
        return ResponseEntity.status(status).header("accessToken", accessToken).body(resultMap);
    }

    //카카오로그인
    @GetMapping("/login/kakao")
    public ResponseEntity<Map<String, Object>> kakaoLogin(@RequestParam("code") String code) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.OK;
        String accessToken = "";
        try {
            String kakaoAcessToken = memberService.getKakaoAccessToken(code, "member/login/kakao");
            Map<String, Object> kakaoMemberInfo = memberService.getKakaoMemberInfo(kakaoAcessToken);
            log.info(kakaoMemberInfo.toString());
            accessToken = memberService.login(kakaoMemberInfo.get("id").toString(), "", "kakao");
            resultMap.put("message", "success");
        } catch (Exception e) {
            resultMap.put("message", e.getMessage());
            status = HttpStatus.BAD_REQUEST;
        }
        return ResponseEntity.status(status).header("accessToken", accessToken).body(resultMap);
    }

    //회원가입
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

    // 카카오 로그인 코드로 카카오 회원가입 시 정보 받아오기
    @GetMapping("/join/kakao")
    public ResponseEntity<Map<String, Object>> kakaoJoin(@RequestParam("code") String code) {
        HttpStatus status = HttpStatus.OK;
        Map<String, Object> resultMap = new HashMap<>();
        try {
            String kakaoAcessToken = memberService.getKakaoAccessToken(code, "member/join/kakao");
            resultMap = memberService.getKakaoMemberInfo(kakaoAcessToken);
        } catch (Exception e) {
            resultMap.put("message", e.getMessage());
            status = HttpStatus.BAD_REQUEST;
        }
        return ResponseEntity.status(status).body(resultMap);
    }

    //토큰에 저장된 인덱스로 본인 정보
    @GetMapping("/info/mine")
    public ResponseEntity<MyInfoResponseDto> myInfo(HttpServletRequest request) {
        Member result = null;
        HttpStatus status = HttpStatus.OK;
        try {
            //토큰으로 유저 정보 받아옴
            Long accessMemberIndex = (Long) request.getAttribute("accessMemberIndex");
            log.info("accessMemberIndex={}", accessMemberIndex);
            result = memberService.info(accessMemberIndex);
            log.info("result={}", result);
        } catch (NullPointerException e) {
            status = HttpStatus.NOT_FOUND;
        } catch (Exception e) {
            status = HttpStatus.BAD_REQUEST;
        }
        return ResponseEntity.status(status).body(new MyInfoResponseDto(result));
    }

    // 남의 정보 가져올 예정
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
    // 아이디 중복 체크: 홈페이지 로그인만 체크 요청이 들어온다고 가정
    @GetMapping("/dup-check/id")
    public ResponseEntity<Map<String, Object>> dupCheckId(@RequestParam("id") String id) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.OK;
        try {
            log.info("id={}", id);
            log.info("result={}", memberRepository.findByMemberIdAndMemberPlatform(id, "origin"));
            memberRepository.findByMemberIdAndMemberPlatform(id, "origin")
                    .orElseThrow(() -> new UsernameNotFoundException("사용 가능한 아이디입니다."));
            resultMap.put("message", "이미 존재하는 아이디입니다.");
        } catch (UsernameNotFoundException e) {
            resultMap.put("message", e.getMessage());
        } catch (Exception e) {
            resultMap.put("message", e.getMessage());
            status = HttpStatus.BAD_REQUEST;
        }
        return ResponseEntity.status(status).body(resultMap);
    }

    //이메일 중복 체크
    @GetMapping("/dup-check/email")
    public ResponseEntity<Map<String, Object>> dupCheckEmail(@RequestParam("email") String email) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.OK;
        try {
            memberRepository.findByMemberEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("사용 가능한 이메일입니다."));
            resultMap.put("message", "이미 존재하는 이메일입니다.");
        } catch (UsernameNotFoundException e) {
            resultMap.put("message", e.getMessage());
        } catch (Exception e) {
            resultMap.put("message", e.getMessage());
            status = HttpStatus.BAD_REQUEST;
        }
        return ResponseEntity.status(status).body(resultMap);
    }

    //닉네임 중복 체크
    @GetMapping("/dup-check/nickname")
    public ResponseEntity<Map<String, Object>> dupCheckNickname(@RequestParam("nickname") String nickname) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.OK;
        try {
            memberRepository.findByMemberNickname(nickname)
                    .orElseThrow(() -> new UsernameNotFoundException("사용 가능한 닉네임입니다."));
            resultMap.put("message", "이미 존재하는 닉네임입니다.");
        } catch (UsernameNotFoundException e) {
            resultMap.put("message", e.getMessage());
        } catch (Exception e) {
            resultMap.put("message", e.getMessage());
            status = HttpStatus.BAD_REQUEST;
        }
        return ResponseEntity.status(status).body(resultMap);
    }

    //통합 정보 수정
    @PutMapping
    public ResponseEntity<Map<String, Object>> updateMember(@RequestBody MemberUpdateRequestDto memberUpdateRequestDto, HttpServletRequest request) {
        HttpStatus status = HttpStatus.OK;
        Map<String, Object> resultMap = new HashMap<>();
        try {
            //신청유저 != 대상유저인데 관리자도 아니라면
            log.info("index={}", memberUpdateRequestDto);
            if ((Long) request.getAttribute("accessMemberIndex") != memberUpdateRequestDto.getMemberIndex()
                    && !request.getAttribute("accessMemberRole").equals("ADMIN")) {
                status = HttpStatus.UNAUTHORIZED;
                throw new IllegalAccessException("잘못된 접근입니다.");
            }
            memberService.updateMember(memberUpdateRequestDto);
            resultMap.put("message", "success");
        } catch (Exception e) {
            resultMap.put("message", e.getMessage());
            status = HttpStatus.BAD_REQUEST;
        }
        return ResponseEntity.status(status).body(resultMap);
    }

    @GetMapping("/check/email")
    public ResponseEntity<Map<String, Object>> sendEmail(@RequestParam("email") String email) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.OK;
        try {
            String code = memberService.sendEmail(email, "check_email");
            resultMap.put("code", code);
        } catch (Exception e) {
            resultMap.put("message", e.getMessage());
            status = HttpStatus.BAD_REQUEST;
        }
        return ResponseEntity.status(status).body(resultMap);
    }

    @GetMapping("/find/id")
    public ResponseEntity<Map<String, Object>> findId(@RequestParam("name") String name, @RequestParam("email") String email) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.OK;
        try {
            Member accessMember = memberRepository.findByMemberNameAndMemberEmailAndMemberPlatform(name, email, "origin")
                    .orElseThrow(() -> new UsernameNotFoundException("사용자 정보를 찾을 수 없습니다."));
            resultMap.put("id", accessMember.getMemberId());
        } catch (Exception e) {
            resultMap.put("message", e.getMessage());
            status = HttpStatus.BAD_REQUEST;
        }
        return ResponseEntity.status(status).body(resultMap);
    }

    @PostMapping("/find/pass")
    public ResponseEntity<Map<String, Object>> findPass(@RequestBody MemberFindPassDto memberFindPassDto) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.OK;
        try {
            memberService.findPass(memberFindPassDto);
            resultMap.put("message", "입력하신 이메일로 임시 비밀번호가 발송되었습니다.");
        } catch (Exception e) {
            resultMap.put("message", e.getMessage());
            status = HttpStatus.BAD_REQUEST;
        }
        return ResponseEntity.status(status).body(resultMap);
    }

    @GetMapping("/ban")
    public ResponseEntity<Map<String, Object>> banMember(@RequestParam("index") long memberIndex) {
        //filter로 관리자만
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.OK;
        try {
            memberService.banMember(memberIndex);
            resultMap.put("message", "ban success");
        } catch (Exception e) {
            resultMap.put("message", e.getMessage());
            status = HttpStatus.BAD_REQUEST;
        }
        return ResponseEntity.status(status).body(resultMap);
    }

    @GetMapping("/search/list")
    public ResponseEntity<List<MemberSearchResponseDto>> searchMemmberList(HttpServletRequest request) {
        HttpStatus status = HttpStatus.OK;
        List<MemberSearchResponseDto> responseDtoList=null;
        try {
            Long accessMemberIndex = (Long) request.getAttribute("accessMemberIndex");
            List<Member> memberList = memberRepository.findAllExcept(accessMemberIndex);
            responseDtoList = memberList.stream()
                    .map(m->new MemberSearchResponseDto(m.getMemberIndex(),m.getMemberNickname())).collect(Collectors.toList());
        } catch (Exception e) {
            status = HttpStatus.BAD_REQUEST;
        }
        return ResponseEntity.status(status).body(responseDtoList);
    }
}

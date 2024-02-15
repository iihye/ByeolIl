package com.stella.stella.member.service;

import com.stella.stella.board.dto.BoardDeleteRequestDto;
import com.stella.stella.board.entity.Board;
import com.stella.stella.board.entity.BoardDeleteYN;
import com.stella.stella.board.repository.BoardRepository;
import com.stella.stella.board.service.BoardService;
import com.stella.stella.common.Jwt.JwtTokenProvider;
import com.stella.stella.common.Jwt.TokenInfo;
import com.stella.stella.common.email.Aes256;
import com.stella.stella.common.email.EmailSender;
import com.stella.stella.member.dto.MemberFindPassDto;
import com.stella.stella.member.dto.MemberJoinRequestDto;
import com.stella.stella.member.dto.MemberUpdateRequestDto;
import com.stella.stella.member.entity.Member;
import com.stella.stella.member.entity.MemberDeleteYN;
import com.stella.stella.member.entity.MemberRole;
import com.stella.stella.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailSender emailSender;
    private final BoardService boardService;
    private final BoardRepository boardRepository;
    private final Aes256 aes256;

    @Value("${social.url}")
    private String redirectUrl;
    @Value("${kakao.key}")
    private String kakaoRestAPIKey;
    @Value("${google.client-id}")
    private String googleClientId;
    @Value("${google.client-secret}")
    private String googleClientSecret;
    @Value("${naver.client-id}")
    private String naverClientId;
    @Value("${naver.client-secret}")
    private String naverClientSecret;

    @Transactional
    public String login(String memberId, String memberPass, String memberPlatform) throws Exception {
        log.info("pass={}", memberPass);
        // 0. memberId와 memeberPlatform으로 memberIndex(PK) 검색
        Member accessMember = memberRepository.findByMemberIdAndMemberPassAndMemberPlatform(memberId, memberPass, memberPlatform)
                .orElseThrow(() -> new UsernameNotFoundException("해당하는 유저를 찾을 수 없습니다."));

        if (accessMember.getMemberDeleteYN() == MemberDeleteYN.Y) {
            throw new IllegalAccessException("탈퇴 처리된 계정입니다. 탈퇴일: " + accessMember.getMemberDeleteDate());
        }

        if (accessMember.getMemberRole().equals(MemberRole.BAN)) {
            throw new IllegalAccessException("차단된 사용자입니다. 차단일: " + accessMember.getMemberBanDate());
        }

        // 1. Login Index/PW 를 기반으로 Authentication 객체 생성
        // 이때 authentication 는 인증 여부를 확인하는 authenticated 값이 false
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                accessMember.getMemberIndex(), memberPass);

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

    public String getKakaoAccessToken(String code, String url) {
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

        params.add("redirect_uri", redirectUrl+url);
//        params.add("redirect_uri", "http://localhost:3000" + url);
        params.add("code", code);

        // Set http entity
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
        //
        ResponseEntity<String> stringResponseEntity = restTemplate.postForEntity(REQUEST_URL, request, String.class);

        JSONObject jsonObject = new JSONObject(stringResponseEntity.getBody());

        return jsonObject.getString("access_token");
    }

    public String getGoogleAccessToken(String code, String url) {
        String REQUEST_URL = "https://oauth2.googleapis.com/token";
        RestTemplate restTemplate = new RestTemplate();

        // Set Header
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.add("Accept", "application/json");

        // Set parameter
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", googleClientId);
        params.add("client_secret", googleClientSecret);
        params.add("redirect_uri", redirectUrl + url);
//        params.add("redirect_uri", "http://localhost:8080/" + url);
        params.add("code", code);

        // Set http entity
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
        //
        ResponseEntity<String> stringResponseEntity = restTemplate.postForEntity(REQUEST_URL, request, String.class);

        JSONObject jsonObject = new JSONObject(stringResponseEntity.getBody());

        return jsonObject.getString("access_token");
    }

    public String getNaverAccessToken(String code, String url) {
        String REQUEST_URL = "https://nid.naver.com/oauth2.0/token";
        RestTemplate restTemplate = new RestTemplate();

        // Set Header
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.add("Accept", "application/json");

        // Set parameter
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", naverClientId);
        params.add("client_secret", naverClientSecret);
        params.add("code", code);
        params.add("state", "1234");

        // Set http entity
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        ResponseEntity<String> stringResponseEntity = restTemplate.postForEntity(REQUEST_URL, request, String.class);

        JSONObject jsonObject = new JSONObject(stringResponseEntity.getBody());

        return jsonObject.getString("access_token");
    }

    public HashMap<String, Object> getKakaoMemberInfo(String kakaoAcessToken) {
        String KAKAO_USERINFO_REQUEST_URL = "https://kapi.kakao.com/v2/user/me";

        RestTemplate restTemplate = new RestTemplate();

        // Set Header
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.add("Authorization", "Bearer " + kakaoAcessToken);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        // Set http entity
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        ResponseEntity<String> stringResponseEntity = restTemplate.postForEntity(KAKAO_USERINFO_REQUEST_URL, request, String.class);

        JSONObject jsonObject = new JSONObject(stringResponseEntity.getBody());

        HashMap<String, Object> memberInfo = new HashMap<>();
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

    public HashMap<String, Object> getGoogleMemberInfo(String googleAccessToken) {
        String GOOGLE_USERINFO_REQUEST_URL = "https://www.googleapis.com/oauth2/v1/userinfo";

        RestTemplate restTemplate = new RestTemplate();

        //header에 accessToken을 담는다.
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.add("Authorization", "Bearer " + googleAccessToken);

        //HttpEntity를 하나 생성해 헤더를 담아서 restTemplate으로 구글과 통신하게 된다.
        HttpEntity request = new HttpEntity(headers);

        ResponseEntity<String> response = restTemplate.exchange(
                GOOGLE_USERINFO_REQUEST_URL,
                HttpMethod.GET,
                request,
                String.class
        );

        JSONObject jsonObject = new JSONObject(response.getBody());

        HashMap<String, Object> memberInfo = new HashMap<>();
        memberInfo.put("id", jsonObject.getString("id"));
        memberInfo.put("email", jsonObject.getString("email"));
        memberInfo.put("name", jsonObject.getString("name"));

        return memberInfo;
    }

    public HashMap<String, Object> getNaverMemberInfo(String naverAccessToken) {
        String NAVER_USERINFO_REQUEST_URL = "https://openapi.naver.com/v1/nid/me";

        RestTemplate restTemplate = new RestTemplate();

        //header에 accessToken을 담는다.
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.add("Authorization", "Bearer " + naverAccessToken);

        //HttpEntity를 하나 생성해 헤더를 담아서 restTemplate으로 구글과 통신하게 된다.
        HttpEntity request = new HttpEntity(headers);

        ResponseEntity<String> response = restTemplate.exchange(
                NAVER_USERINFO_REQUEST_URL,
                HttpMethod.GET,
                request,
                String.class
        );

        JSONObject jsonObject = new JSONObject(response.getBody());
        jsonObject = jsonObject.getJSONObject("response");

        HashMap<String, Object> memberInfo = new HashMap<>();
        memberInfo.put("id", jsonObject.getString("id"));
        memberInfo.put("email", jsonObject.getString("email"));
        memberInfo.put("name", jsonObject.getString("name"));
        memberInfo.put("nickname", jsonObject.getString("nickname"));
        memberInfo.put("birthday", jsonObject.getString("birthday"));

        return memberInfo;
    }

    public void join(MemberJoinRequestDto memberJoinRequestDto) {
        Member newMember = memberJoinRequestDto.toEntity();
        memberRepository.save(newMember);
    }

    //Member 엔티티를 전부 보내는 메서드: 컨트롤러에서 Dto로 변환 필요
    public Member info(long memberIndex) {
        return memberRepository.findByMemberIndex(memberIndex)
                .orElseThrow(() -> new UsernameNotFoundException("해당하는 유저를 찾을 수 없습니다."));
    }

    //통합 회원정보 수정 메서드
    public void updateMember(MemberUpdateRequestDto memberUpdateRequestDto) {
        Member member = memberRepository.findByMemberIndex(memberUpdateRequestDto.getMemberIndex())
                .orElseThrow(() -> new UsernameNotFoundException("해당하는 유저를 찾을 수 없습니다."));
        Optional.ofNullable(memberUpdateRequestDto.getMemberNickname()).ifPresent(member::setMemberNickname);
        Optional.ofNullable(memberUpdateRequestDto.getMemberPass()).ifPresent(member::setMemberPass);
        Optional.ofNullable(memberUpdateRequestDto.getMemberEmail()).ifPresent(member::setMemberEmail);
        Optional.ofNullable(memberUpdateRequestDto.getMemberAlarmStatus()).ifPresent(member::setMemberAlarmStatus);
        Optional.ofNullable(memberUpdateRequestDto.getMemberRadioStatus()).ifPresent(member::setMemberRadioStatus);
        Optional.ofNullable(memberUpdateRequestDto.getMemberBirth()).ifPresent(member::setMemberBirth);
        Optional.ofNullable(memberUpdateRequestDto.getMemberDeleteDate()).ifPresent(member::setMemberDeleteDate);
    }

    public void deleteMember(long memberIndex) {
        Member member = memberRepository.findByMemberIndex(memberIndex)
                .orElseThrow(() -> new UsernameNotFoundException("해당하는 유저를 찾을 수 없습니다."));
        member.setMemberDeleteYN(MemberDeleteYN.Y);
        member.setMemberDeleteDate(LocalDate.now());
        for (Board b : boardRepository.findAllByMemberIndexForDelete(memberIndex, BoardDeleteYN.N)) {
            boardService.removeBoard(BoardDeleteRequestDto.builder()
                    .boardIndex(b.getBoardIndex())
                    .memberIndex(memberIndex)
                    .build());
        }
    }

    public String sendEmail(String email, String order) {
        String result = "";
        String title = "";
        String content = "";
        switch (order) {
            case "check_email":
                title = "Stella 이메일 인증 코드입니다.";
                content = "Stella에서 보낸 이메일 인증용 코드입니다.<br>아래의 인증번호를 입력해 주세요.<br><br>코드: ";
                result = emailSender.generateCode();
                emailSender.sendMail(email, title, content + result);
                result = aes256.encrypt(result);
                break;
            case "find_pass":
                title = "Stella에서 생성한 임시 비밀번호입니다.";
                content = "Stella에서 생성한 임시 비밀번호입니다.<br>아래의 비밀번호를 사용해 로그인해 주세요.<br><br>임시 비밀번호: ";
                result = emailSender.generateCode();
                emailSender.sendMail(email, title, content + result);
                break;
        }
        return result;
    }

    public void findPass(MemberFindPassDto memberFindPassDto) {
        Member accessMember = memberRepository.findByMemberIdAndMemberNameAndMemberEmailAndMemberPlatform
                        (memberFindPassDto.getMemberId(), memberFindPassDto.getMemberName()
                                , memberFindPassDto.getMemberEmail(), "origin")
                .orElseThrow(() -> new UsernameNotFoundException("사용자 정보를 찾을 수 없습니다."));
        String tmpPass = sendEmail(accessMember.getMemberEmail(), "find_pass");
        //암호화
        accessMember.setMemberPass(UUID.nameUUIDFromBytes(tmpPass.getBytes()).toString());
    }

    public void banMember(long memberIndex) {
        Member targetMember = memberRepository.findByMemberIndex(memberIndex)
                .orElseThrow(() -> new UsernameNotFoundException("사용자 정보를 찾을 수 없습니다."));
        targetMember.setMemberRole(MemberRole.BAN);
        targetMember.setMemberBanDate(LocalDate.now());
    }
}
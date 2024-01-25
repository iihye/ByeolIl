package com.stella.stella.common.Jwt;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
@AllArgsConstructor
public class TokenInfo {
 
    private String grantType;
    private String accessToken;
    private String refreshToken;
}

/*
JWT Token 구성
	Header: 
	Payload: 사용할 데이터 
	Signature: Server에서 Client는 모르는 암호화 로직, 키 값으로 Server에서 Payload를 암호화 한 데이터

모바일/모바일 웹
	refresh token으로 access token 무한 연장 가능

웹
	토큰 유효시간과 갱신 가능 시간 따로 설정 예)유효 시간 30분 전부터 갱신 가능
	Token Expire Time(리프레시 토큰이 있어도 갱신 불가)
*/
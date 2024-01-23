package com.stella.stella.common.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CustomExceptionStatus {
    // member 관련
    WRONG_ID(1001, "잘못된 아이디입니다"),
    WRONG_PW(1002, "잘못된 비밀번호입니다"),
    MEMER_RESTRICT(1003, "제한된 사용자입니다"),
    ACCESS_TOKEN_INVALID(1004, "유효하지 않은 액세스 토큰입니다"),
    REFRESH_TOKEN_INVALID(1005, "유효하지 않은 리프레시 토큰입니다"),
    FIND_ID_INVALID(1006, "유효하지 않은 정보입니다"),
    FIND_PW_INVALID(1007, "유효하지 않은 정보입니다"),
    MEMBER_INVALID(1008, "존재하지 않는 사용자입니다"),

    // board 관련

    // follow 관련
    FOLLOW_INVALID(1201, "존재하지 않는 팔로잉입니다");

    // alarm 관련

    // radio 관련

    // report 관련

    private final Integer code;
    private final String message;
}

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
    BOARDID_INVALID(1101, "유효하지 않은 게시글 정보입니다."),
    MEMBERID_INVALID(1102, "유효한 멤버 정보가 아닙니다."),
    HEART_INVALID(1103,"유효한 좋아요 정보가 아닙니다."),
    COMMENTID_INVALID(1104, "유효한 댓글 정보가 아닙니다."),
    MULTICOMMENTINDEX_INVALID(1105,"유효한 답댓글 정보가 아닙니다."),

    NO_HEART_CONTENT(1106, "좋아요한 게시글이 없습니다."),
    NO_HASH_TAG(1107,"해당하는 태그가 존재하지 않습니다."),
    NO_RADIO_CONTENT(1108,"유저에 해당하는 라디오가 존재하지 않습니다."),

    ALREADY_LOCATED(1109,"이미 지정된 자리입니다."),
    ALREADY_HEARTED(1110,"이미 좋아요한 게시글입니다."),
    ALREADY_REPORTED(1111,"이미 신고한 게시글입니다."),

    INPUT_DATA_NONE(1112,"입력값이 없습니다."),
    BOARD_DELETED(1113, "삭제된 게시글 입니다."),
    // follow 관련
    FOLLOW_INVALID(1201, "존재하지 않는 팔로잉입니다"),

    // alarm 관련
    ALARM_INVALID(1301, "존재하지 않는 알림입니다"),
    INTERNAL_ERROR(1302, "알림을 가져올 수 없습니다"),
    CONNECT_ERROR(1303, "알림을 연결할 수 없습니다");

    // radio 관련

    // report 관련

    private final Integer code;
    private final String message;
}

package com.stella.stella.member.dto;

import java.sql.Date;

public class MemberUpdateRequestDto {
    private long memberIndex;
    private String memberPass, memberRole, memberNickname, memberEmail, memberAlarmStatus, memberRadioStatus, memberDeleteYN;
    private Date memberBirth, memberBanDate, memberDeleteDate;
}

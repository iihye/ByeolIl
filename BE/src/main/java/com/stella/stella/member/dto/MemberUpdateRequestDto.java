package com.stella.stella.member.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberUpdateRequestDto {
    private long memberIndex;
    private String memberNickname, memberEmail, memberAlarmStatus, memberRadioStatus, memberDeleteYN;
    private Date memberBirth, memberDeleteDate;
}
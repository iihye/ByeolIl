package com.stella.stella.member.dto;

import com.stella.stella.member.entity.MemberAlarmStatus;
import com.stella.stella.member.entity.MemberDeleteYN;
import com.stella.stella.member.entity.MemberRadioStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberUpdateRequestDto {
    private long memberIndex;
    private String memberNickname, memberEmail, memberPass;
    private MemberAlarmStatus memberAlarmStatus;
    private MemberRadioStatus memberRadioStatus;
    private LocalDate memberBirth, memberDeleteDate;
}
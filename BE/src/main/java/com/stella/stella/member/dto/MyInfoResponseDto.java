package com.stella.stella.member.dto;

import com.stella.stella.member.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MyInfoResponseDto {
	private String memberId, memberPlatform, memberName, memberNickname, memberEmail, memberAlarmStatus,
			memberRadioStatus,memberDeletedYN;
	private LocalDate memberBirth, memberBanDate,memberRegDate;
	
	public MyInfoResponseDto(Member member) {
		memberId = member.getMemberId();
		memberPlatform = member.getMemberPlatform();
		memberName = member.getMemberName();
		memberNickname = member.getMemberNickname();
		memberEmail = member.getMemberEmail();
		memberAlarmStatus = member.getMemberAlarmStatus().toString();
		memberRadioStatus = member.getMemberRadioStatus().toString();
		memberBanDate = member.getMemberBanDate();
		memberBirth = member.getMemberBirth();
		memberRegDate=member.getMemberRegDate();
		memberDeletedYN=member.getMemberDeleteYN().toString();
	}
}

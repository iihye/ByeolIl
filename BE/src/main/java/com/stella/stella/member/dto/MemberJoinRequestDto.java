package com.stella.stella.member.dto;

import com.stella.stella.member.entity.Member;
import com.stella.stella.member.entity.MemberAlarmStatus;
import com.stella.stella.member.entity.MemberRadioStatus;
import com.stella.stella.member.entity.MemberRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberJoinRequestDto {
	private String memberId, memberPass, memberPlatform, memberName, memberNickname, memberEmail;
	private LocalDate memberBirth;
	
	public Member toEntity(){
		return Member.builder()
				.memberId(memberId)
				.memberPass(memberPass)
				.memberPlatform(memberPlatform)
				.memberRole(MemberRole.USER)
				.memberName(memberName)
				.memberBirth(memberBirth)
				.memberNickname(memberNickname)
				.memberEmail(memberEmail)
				.memberAlarmStatus(MemberAlarmStatus.ACCEPT)
				.memberRadioStatus(MemberRadioStatus.OLDEST)
				.build();
	}
}

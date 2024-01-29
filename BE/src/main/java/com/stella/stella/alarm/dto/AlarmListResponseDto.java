package com.stella.stella.alarm.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlarmListResponseDto {
    Long alarmIndex;
    String toMemberNickName;
    String alarmType;
    Long boardIndex;
}

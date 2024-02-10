package com.stella.stella.alarm.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlarmListResponseDto {
    Long alarmIndex;
    String fromMemberNickName;
    String alarmType;
    Long boardIndex;
}

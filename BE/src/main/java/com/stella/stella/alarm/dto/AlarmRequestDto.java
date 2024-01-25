package com.stella.stella.alarm.dto;

import com.stella.stella.alarm.entity.AlarmType;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlarmRequestDto {
    Long toMemberIndex;
    Long fromMemberIndex;
    AlarmType alarmType;
    Long boardIndex;
}
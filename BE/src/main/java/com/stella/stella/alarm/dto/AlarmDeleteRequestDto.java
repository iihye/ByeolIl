package com.stella.stella.alarm.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlarmDeleteRequestDto {
    Long memberIndex;
    Long alarmIndex;
}

package com.stella.stella.alarm.controller;

import com.stella.stella.alarm.dto.AlarmDeleteRequestDto;
import com.stella.stella.alarm.dto.AlarmListResponseDto;
import com.stella.stella.alarm.dto.AlarmRequestDto;
import com.stella.stella.alarm.service.AlarmService;
import com.stella.stella.common.dto.BasicResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/alarm")
public class AlarmController {
    private final AlarmService alarmService;

    // 알림 등록(테스트용)
    @PostMapping("/add")
    public ResponseEntity<Object> alarmAdd(@RequestBody AlarmRequestDto alarmRequestDto) {
        alarmService.addAlarm(alarmRequestDto);

        BasicResponseDto basicResponse = BasicResponseDto.builder()
                .message("success")
                .count(0)
                .build();

        return ResponseEntity.ok(basicResponse);
    }

    // 알림 삭제
    @PostMapping("/check")
    public ResponseEntity<Object> alarmRemove(@RequestBody AlarmDeleteRequestDto alarmDeleteRequestDto) {
        alarmService.removeAlarm(alarmDeleteRequestDto);

        BasicResponseDto basicResponse = BasicResponseDto.builder()
                .message("success")
                .count(0)
                .build();

        return ResponseEntity.ok(basicResponse);
    }

    // 알림 리스트
    @GetMapping("/list/{memberIndex}")
    public ResponseEntity<Object> alarmList(@PathVariable Long memberIndex) {
        List<AlarmListResponseDto> alarmListResponseDtos = alarmService.findAlarm(memberIndex);

        BasicResponseDto basicResponse = BasicResponseDto.builder()
                .message("success")
                .count(alarmListResponseDtos.size())
                .result(alarmListResponseDtos)
                .build();

        return ResponseEntity.ok(basicResponse);
    }


}
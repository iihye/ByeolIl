package com.stella.stella.alarm.service;

import com.stella.stella.alarm.repository.EmitterRepository;
import com.stella.stella.common.exception.CustomException;
import com.stella.stella.common.exception.CustomExceptionStatus;
import com.stella.stella.member.entity.Member;
import com.stella.stella.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

@Slf4j
@Service
@RequiredArgsConstructor
public class SseService {
    private final EmitterRepository emitterRepository;

    private final Long DEFAULT_TIMEOUT = 60L * 1000;
    private final String ALARM_NAME = "alarm";

    // 알림 SSE
    public void send(final long alarmId, final Long memberIndex, final String msg) {
        emitterRepository.get(memberIndex).ifPresentOrElse(sseEmitter -> {
            try {
                sseEmitter.send(SseEmitter.event().id(createAlarmId(memberIndex, alarmId)).name(ALARM_NAME).data(msg));
            } catch (IOException e) {
                emitterRepository.delete(memberIndex);
                throw new CustomException(CustomExceptionStatus.INTERNAL_ERROR);
            }
        }, () -> log.info("[SseEmitter] {} SseEmitter Not Founded", memberIndex));
    }

    public SseEmitter connectAlarm(Long memberIndex) {
        SseEmitter sseEmitter = new SseEmitter(DEFAULT_TIMEOUT);
        emitterRepository.save(memberIndex, sseEmitter);

        // 종료 되었을 때 처리
        sseEmitter.onCompletion(() -> {
            emitterRepository.delete(memberIndex);
        });

        // timeOut 시 처리
        sseEmitter.onTimeout(() -> {
            emitterRepository.delete(memberIndex);
        });

        try {
            sseEmitter.send(SseEmitter.event().id(createAlarmId(memberIndex, null)).name(ALARM_NAME).data("connect completed!!"));
        } catch (IOException e) {
            throw new CustomException(CustomExceptionStatus.CONNECT_ERROR);
        }

        return sseEmitter;
    }

    private String createAlarmId(Long memberIndex, Long alarmId) {
        if (alarmId == null) {
            return memberIndex + "_" + System.currentTimeMillis();
        }

        return memberIndex + "_" + alarmId;
    }
}

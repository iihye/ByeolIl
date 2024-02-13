package com.stella.stella.alarm.repository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Repository
public class EmitterRepository {

    private Map<Long, SseEmitter> emitterMap = new ConcurrentHashMap<>();

    public SseEmitter save(Long memberIndex, SseEmitter sseEmitter) {
        if (emitterMap.containsKey(memberIndex)) {
            emitterMap.remove(memberIndex);
        }
        emitterMap.put(memberIndex, sseEmitter);

        log.info("[SseEmitter] Set {}", memberIndex);
        return sseEmitter;
    }

    public Optional<SseEmitter> get(Long memberIndex) {
        SseEmitter sseEmitter = emitterMap.get(memberIndex);

        log.info("[SseEmitter] Get {}", memberIndex);
        return Optional.ofNullable(sseEmitter);
    }

    public void delete(Long memberIndex) {
        emitterMap.remove(memberIndex);
    }
}
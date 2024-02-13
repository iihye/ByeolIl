package com.stella.stella.alarm.service;

import com.stella.stella.alarm.dto.AlarmDeleteRequestDto;
import com.stella.stella.alarm.dto.AlarmListResponseDto;
import com.stella.stella.alarm.dto.AlarmRequestDto;
import com.stella.stella.alarm.entity.Alarm;
import com.stella.stella.alarm.entity.Alarmcheck;
import com.stella.stella.alarm.repository.AlarmRepository;
import com.stella.stella.alarm.repository.AlarmcheckRepository;
import com.stella.stella.alarm.repository.EmitterRepository;
import com.stella.stella.board.entity.Board;
import com.stella.stella.board.repository.BoardRepository;
import com.stella.stella.common.exception.CustomException;
import com.stella.stella.common.exception.CustomExceptionStatus;
import com.stella.stella.member.entity.Member;
import com.stella.stella.member.repository.MemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AlarmService {

    private final AlarmRepository alarmRepository;
    private final AlarmcheckRepository alarmcheckRepository;
    private final MemberRepository memberRepository;
    private final BoardRepository boardRepository;
    private final EmitterRepository emitterRepository;

    private final Long DEFAULT_TIMEOUT = 60L * 1000 * 60;
    private final String ALARM_NAME = "alarm";

    // 알림 등록
    public void addAlarm(AlarmRequestDto alarmRequestDto){
        Member toMember = memberRepository.findByMemberIndex(alarmRequestDto.getToMemberIndex())
                .orElseThrow(() -> new CustomException(CustomExceptionStatus.MEMBER_INVALID));

        Member fromMember = memberRepository.findByMemberIndex(alarmRequestDto.getFromMemberIndex())
                .orElseThrow(() -> new CustomException(CustomExceptionStatus.MEMBER_INVALID));
        
        if(toMember.getMemberIndex() == fromMember.getMemberIndex()) return;

        Alarm alarm;

        if(alarmRequestDto.getBoardIndex() != null) {
            Board board = boardRepository.findByBoardIndex(alarmRequestDto.getBoardIndex())
                    .orElseThrow(() -> new CustomException(CustomExceptionStatus.BOARDID_INVALID));

            alarm = Alarm.builder()
                    .toMember(toMember)
                    .fromMember(fromMember)
                    .alarmType(alarmRequestDto.getAlarmType())
                    .board(board)
                    .build();
        } else{
            alarm = Alarm.builder()
                    .toMember(toMember)
                    .fromMember(fromMember)
                    .alarmType(alarmRequestDto.getAlarmType())
                    .build();
        }

        alarmRepository.save(alarm);
    }


    // 알림 삭제
    public void removeAlarm(AlarmDeleteRequestDto alarmDeleteRequestDto){
        Member member = memberRepository.findByMemberIndex(alarmDeleteRequestDto.getMemberIndex())
                .orElseThrow(() -> new CustomException(CustomExceptionStatus.MEMBER_INVALID));

        Alarm alarm = alarmRepository.findById(alarmDeleteRequestDto.getAlarmIndex())
                .orElseThrow(() -> new CustomException(CustomExceptionStatus.ALARM_INVALID));

        Alarmcheck alarmcheck = Alarmcheck.builder()
                .alarm(alarm)
                .build();

        alarmcheckRepository.save(alarmcheck);
    }

    // 알림 조회
    public List<AlarmListResponseDto> findAlarm(Long memberIndex){
        Member member = memberRepository.findByMemberIndex(memberIndex)
                .orElseThrow(() -> new CustomException(CustomExceptionStatus.MEMBER_INVALID));

        List<Alarm> alarms = alarmRepository.findAllByToMemberIndex(memberIndex);
        List<AlarmListResponseDto> alarmListResponseDtos = new ArrayList<>();

        for (Alarm alarm : alarms) {
            Optional<Long> boardIndex = Optional.ofNullable(alarm.getBoard()).map(Board::getBoardIndex);

            AlarmListResponseDto a = AlarmListResponseDto.builder()
                    .alarmIndex(alarm.getAlarmIndex())
                    .fromMemberNickName(alarm.getFromMember().getMemberNickname())
                    .alarmType(alarm.getAlarmType().toString())
                    .boardIndex(boardIndex.orElse(null))
                    .build();

            alarmListResponseDtos.add(a);
        }

        return alarmListResponseDtos;
    }

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
        Member findMember = memberRepository.findByMemberIndex(memberIndex)
                .orElseThrow(() -> new CustomException(CustomExceptionStatus.MEMBER_INVALID));

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
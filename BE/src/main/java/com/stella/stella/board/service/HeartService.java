package com.stella.stella.board.service;

import com.stella.stella.board.dto.HeartRequestDto;
import com.stella.stella.board.entity.Board;
import com.stella.stella.board.entity.BoardDeleteYN;
import com.stella.stella.board.entity.Heart;
import com.stella.stella.board.repository.BoardRepository;
import com.stella.stella.board.repository.HeartRepository;
import com.stella.stella.common.exception.CustomException;
import com.stella.stella.common.exception.CustomExceptionStatus;
import com.stella.stella.member.entity.Member;
import com.stella.stella.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class HeartService {

    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;
    private final HeartRepository heartRepository;
    private final RedisTemplate redisTemplate;

    @Transactional
    public void addHeart(HeartRequestDto dto) {
        Board board = boardRepository.findByBoardIndex(dto.getBoardIndex())
                .orElseThrow(() -> new CustomException(CustomExceptionStatus.BOARDID_INVALID));

        if (board.getBoardDeleteYN() == BoardDeleteYN.Y)
            throw new CustomException(CustomExceptionStatus.BOARD_DELETED);

        Member member = memberRepository.findByMemberIndex(dto.getMemberIndex())
                .orElseThrow(() -> new CustomException(CustomExceptionStatus.MEMBER_INVALID));

        if (heartRepository.countByBoardBoardIndexAndMemberMemberIndex(board.getBoardIndex(), member.getMemberIndex()) != 0)
            throw new CustomException(CustomExceptionStatus.ALREADY_HEARTED);
        Heart heart = Heart.builder()
                .board(board)
                .member(member)
                .build();

        heartRepository.save(heart);

        ValueOperations<String, String> values = redisTemplate.opsForValue();
        String key = "board:" + board.getBoardIndex().toString();
//        values.set(key, String.valueOf(0)); // 게시글 만들 때 추가
        String value = values.get(key);

        if (value == null || value.isEmpty())
            throw new CustomException(CustomExceptionStatus.HEART_INVALID);
        values.set(key, String.valueOf(Integer.parseInt(value) + 1));
    }

    @Transactional
    public void removeHeart(HeartRequestDto dto) {
        Board board = boardRepository.findByBoardIndex(dto.getBoardIndex())
                .orElseThrow(() -> new CustomException(CustomExceptionStatus.BOARDID_INVALID));

        Member member = memberRepository.findByMemberIndex(dto.getMemberIndex())
                .orElseThrow(() -> new CustomException(CustomExceptionStatus.MEMBER_INVALID));

        Heart heart = heartRepository.findByBoardBoardIndexAndMemberMemberIndex(board.getBoardIndex(), member.getMemberIndex())
                .orElseThrow(() -> new CustomException(CustomExceptionStatus.HEART_INVALID));
        heartRepository.deleteByBoardBoardIndexAndMemberMemberIndex(board.getBoardIndex(), member.getMemberIndex());

        ValueOperations<String, String> values = redisTemplate.opsForValue();
        String key = "board:" + board.getBoardIndex().toString();
        String value = values.get(key);

        if (value == null)
            throw new CustomException(CustomExceptionStatus.HEART_INVALID);
        values.set(key, String.valueOf(Integer.parseInt(value) - 1));
    }

    // Redis -> Mysql로 하트 정보 보내기
    public void transferRedisToMySQL() {
        Set<String> keySet = redisTemplate.keys("board:" + "*");
        if (keySet != null && !keySet.isEmpty()) {
            List<Object> values = redisTemplate.opsForValue().multiGet(keySet);

            for (int i = 0; i < keySet.size(); i++) {
                String key = keySet.toArray(new String[0])[i].substring(6);
                System.out.println(key);
                Object value = values.get(i);

                Board board = boardRepository.findById(Long.parseLong(key))
                        .orElseThrow(() -> new CustomException(CustomExceptionStatus.BOARDID_INVALID));

                // heart column에 cnt 업데이트

            }
        } else {
            log.info("저장된 key 값이 없어 업데이트 할 수 없습니다");
        }

    }

    // Mysql -> Redis로 하트 정보 보내기
    public void transferMySQLToRedis() {
        // board index 별 heart count 불러오기

        // set 형태로 바꾸기

        // redis에 저장하기
    }
}

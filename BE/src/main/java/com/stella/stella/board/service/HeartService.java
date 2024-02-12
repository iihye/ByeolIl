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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class HeartService {

   private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;
    private final HeartRepository heartRepository;

    @Transactional
    public void addHeart(HeartRequestDto dto) {
        Board board = boardRepository.findByBoardIndex(dto.getBoardIndex())
                .orElseThrow(()->new CustomException(CustomExceptionStatus.BOARDID_INVALID));

        if(board.getBoardDeleteYN()== BoardDeleteYN.Y){
            throw new CustomException(CustomExceptionStatus.BOARD_DELETED);
        }

        Member member = memberRepository.findByMemberIndex(dto.getMemberIndex())
                .orElseThrow(()->new CustomException(CustomExceptionStatus.MEMBER_INVALID));
        if(heartRepository.countByBoardBoardIndexAndMemberMemberIndex(dto.getBoardIndex(),dto.getMemberIndex())!=0) throw new CustomException(CustomExceptionStatus.ALREADY_HEARTED);
        Heart heart = Heart.builder()
                .board(board)
                .member(member)
                .build();

        heartRepository.save(heart);
    }
    @Transactional
    public void removeHeart(HeartRequestDto dto){
        Heart heart = heartRepository.findByBoardBoardIndexAndMemberMemberIndex(dto.getBoardIndex(), dto.getMemberIndex()).orElseThrow(()->new CustomException(CustomExceptionStatus.HEART_INVALID));
        heartRepository.deleteByBoardBoardIndexAndMemberMemberIndex(dto.getBoardIndex(), dto.getMemberIndex());
    }
}

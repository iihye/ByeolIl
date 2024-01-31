package com.stella.stella.radio.service;

import com.stella.stella.board.entity.Board;
import com.stella.stella.board.repository.BoardRepository;
import com.stella.stella.common.exception.CustomException;
import com.stella.stella.common.exception.CustomExceptionStatus;
import com.stella.stella.member.entity.Member;
import com.stella.stella.member.repository.MemberRepository;
import com.stella.stella.radio.dto.RadioCreateRequestDto;
import com.stella.stella.radio.entity.Radio;
import com.stella.stella.radio.repository.RadioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class RadioService {

    private final RadioRepository radioRepository;
    private final MemberRepository memberRepository;
    private final BoardRepository boardRepository;
    @Transactional
    public void addRadio(RadioCreateRequestDto dto){
        Board board = boardRepository.findByBoardIndex(dto.getBoardIndex()).orElseThrow(()->new CustomException(CustomExceptionStatus.BOARDID_INVALID));
        if(board.getMember().getMemberIndex()==dto.getMemberIndex()) {
            Member member = memberRepository.findByRandMember();

            Radio radio = Radio.builder()
                    .board(board)
                    .member(member).build();

            radioRepository.save(radio);
        }else{
            throw new CustomException(CustomExceptionStatus.MEMBERID_INVALID);
        }
    }
}

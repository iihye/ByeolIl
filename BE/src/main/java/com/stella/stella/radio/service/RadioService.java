package com.stella.stella.radio.service;

import com.stella.stella.board.entity.Board;
import com.stella.stella.board.entity.BoardDeleteYN;
import com.stella.stella.board.repository.BoardRepository;
import com.stella.stella.common.exception.CustomException;
import com.stella.stella.common.exception.CustomExceptionStatus;
import com.stella.stella.member.entity.Member;
import com.stella.stella.member.repository.MemberRepository;
import com.stella.stella.radio.dto.RadioCreateRequestDto;
import com.stella.stella.radio.dto.RadioResponseDto;
import com.stella.stella.radio.entity.Radio;
import com.stella.stella.radio.repository.RadioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;

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
        if(board.getBoardDeleteYN()== BoardDeleteYN.Y){
            throw new CustomException(CustomExceptionStatus.BOARD_DELETED);
        }
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

    @Transactional
    public RadioResponseDto findRadio(Long memberIndex){
        Radio radio = radioRepository.findRadio(memberIndex);
        RadioResponseDto dto  = RadioResponseDto.builder()
                .radioIndex(radio.getRadioIndex())
                .boardIndex(radio.getBoard().getBoardIndex())
                .boardContent(radio.getBoard().getBoardContent())
                .boardInputDate(radio.getBoard().getBoardInputDate().format(DateTimeFormatter.ofPattern("yy.MM.dd")))
                .build();
        radioRepository.deleteByRadioIndex(radio.getRadioIndex());
        return dto;
    }

}

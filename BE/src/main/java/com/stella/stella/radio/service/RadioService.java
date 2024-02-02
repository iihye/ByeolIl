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
import com.stella.stella.radio.dto.RadioTossRequestDto;
import com.stella.stella.radio.entity.Radio;
import com.stella.stella.radio.repository.RadioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;

@Slf4j
@Service
@RequiredArgsConstructor
public class RadioService {

    private final RadioRepository radioRepository;
    private final MemberRepository memberRepository;
    private final BoardRepository boardRepository;

    @Transactional
    public void saveRadio(Board board ,RadioCreateRequestDto dto){
        Member fromMember = memberRepository.findByMemberIndex(dto.getMemberIndex()).orElseThrow(()-> new CustomException(CustomExceptionStatus.MEMBERID_INVALID));
        Member toMember = memberRepository.findByRandMember();
        Radio radio = Radio.builder()
                .fromMember(fromMember)
                .board(board)
                .toMember(toMember).build();

        radioRepository.save(radio);
    }

    @Transactional
    public void addRadio(RadioCreateRequestDto dto){

        Board board = boardRepository.findByBoardIndex(dto.getBoardIndex()).orElseThrow(()->new CustomException(CustomExceptionStatus.BOARDID_INVALID));
        //대상이 되는 게시글을 찾음
        if(board.getBoardDeleteYN()== BoardDeleteYN.Y){
            throw new CustomException(CustomExceptionStatus.BOARD_DELETED);
        }
        //게시글이 삭제되었는지 여부 확인
        if(board.getMember().getMemberIndex()==dto.getMemberIndex()) {
            //라디오를 보내려는 사람이 게시글의 작성자인지 확인한 후
            saveRadio(board,dto);
        }else{
            throw new CustomException(CustomExceptionStatus.MEMBERID_INVALID);
        }
    }

    @Transactional
    public RadioResponseDto findRadio(Long memberIndex){
        Radio radio = radioRepository.findRadio(memberIndex).orElseThrow(()->new CustomException(CustomExceptionStatus. NO_RADIO_CONTENT));
        // 받은 멤버의 인덱스로 일기 날짜 오름차순으로 select 쿼리를 보내서 가장 오래된 일기에 대한 라디오를 1개 가져옴
        RadioResponseDto dto  = RadioResponseDto.builder()
                .boardIndex(radio.getBoard().getBoardIndex())
                .boardContent(radio.getBoard().getBoardContent())
                .boardInputDate(radio.getBoard().getBoardInputDate().format(DateTimeFormatter.ofPattern("yy.MM.dd")))
                .build();

        radioRepository.deleteByRadioIndex(radio.getRadioIndex());
        //한번 수신한 라디오는 지움.
        return dto;
    }

    @Transactional
    public void tossRadio(RadioCreateRequestDto dto){
        Board board = boardRepository.findByBoardIndex(dto.getBoardIndex()).orElseThrow(()->new CustomException(CustomExceptionStatus.BOARDID_INVALID));

        if(board.getBoardDeleteYN()== BoardDeleteYN.Y){
            throw new CustomException(CustomExceptionStatus.BOARD_DELETED);
        }
        saveRadio(board,dto);
    }

}

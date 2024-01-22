package com.stella.stella.board.service;

import com.stella.stella.board.dto.BoardCreateRequestDto;
import com.stella.stella.board.entity.Board;
import com.stella.stella.board.repository.BoardRepository;
import com.stella.stella.member.entity.Member;
import com.stella.stella.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class BoardService {


    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public void createBoard(BoardCreateRequestDto dto){
        Optional<Member> op = memberRepository.findByMemberIndex(dto.getUserIndex());
        Member member = op.orElseThrow(NullPointerException::new);

        Board board = Board.builder()
                .boardContent(dto.getBoardContent())
                .boardLocation(dto.getBoardLocation())
                .boardAccess(dto.getBoardAccess())
                .member(member).
                build();

        boardRepository.save(board);
    }
}

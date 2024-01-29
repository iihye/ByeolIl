package com.stella.stella.comment.service;

import com.stella.stella.board.entity.Board;
import com.stella.stella.board.repository.BoardRepository;
import com.stella.stella.comment.dto.CommentCreateRequestDto;
import com.stella.stella.comment.entity.Comment;
import com.stella.stella.comment.repository.CommentRepository;
import com.stella.stella.comment.repository.MulticommentRepository;
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
@Transactional
@RequiredArgsConstructor
public class CommentService {

    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;
    private final CommentRepository commentRepository;
    private final MulticommentRepository multicommentRepository;

    public void saveComment(CommentCreateRequestDto dto){
        System.out.println("Save 시작");
        System.out.println(dto.getCommentContent());
        System.out.println(dto.getBoardIndex());
        System.out.println(dto.getMemberIndex());
        Board board = boardRepository.findByBoardIndex(dto.getBoardIndex()).orElseThrow(()->new CustomException(CustomExceptionStatus.BOARDID_INVALID));
        System.out.println("board 불러옴");
        Member member = memberRepository.findByMemberIndex(dto.getMemberIndex()).orElseThrow(()->new CustomException(CustomExceptionStatus.MEMBERID_INVALID));
        System.out.println("member 불러옴 ");

        Comment comment = Comment.builder()
                .commentContent(dto.getCommentContent())
                .board(board)
                .member(member).build();
        System.out.println("Comment 생성");
        System.out.println("Save 하기");
        commentRepository.save(comment);
        System.out.println("Save 완");
    }
}

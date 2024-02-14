package com.stella.stella.comment.service;

import com.stella.stella.alarm.entity.Alarm;
import com.stella.stella.alarm.entity.AlarmType;
import com.stella.stella.alarm.repository.AlarmRepository;
import com.stella.stella.board.entity.Board;
import com.stella.stella.board.repository.BoardRepository;
import com.stella.stella.comment.dto.CommentCreateRequestDto;
import com.stella.stella.comment.dto.CommentDeleteRequestDto;
import com.stella.stella.comment.dto.CommentListResponseDto;
import com.stella.stella.comment.dto.MultiCommentListResponseDto;
import com.stella.stella.comment.entity.Comment;
import com.stella.stella.comment.entity.MultiComment;
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

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class CommentService {

    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;
    private final CommentRepository commentRepository;
    private final AlarmRepository alarmRepository;

    public void addComment(CommentCreateRequestDto dto) {
        Board board = boardRepository.findByBoardIndex(dto.getBoardIndex()).orElseThrow(() -> new CustomException(CustomExceptionStatus.BOARDID_INVALID));
        Member member = memberRepository.findByMemberIndex(dto.getMemberIndex()).orElseThrow(() -> new CustomException(CustomExceptionStatus.MEMBERID_INVALID));

        Comment comment = Comment.builder()
                .commentContent(dto.getCommentContent())
                .board(board)
                .member(member).build();
        commentRepository.save(comment);

        if(board.getMember().getMemberId() != member.getMemberId()){
            Alarm alarm = Alarm.builder()
                    .toMember(board.getMember())
                    .fromMember(member)
                    .alarmType(AlarmType.CMT)
                    .board(board)
                    .build();

            alarmRepository.save(alarm);
        }
    }

    public void removeComment(CommentDeleteRequestDto dto) {
        Comment comment = commentRepository.findByCommentIndex(dto.getCommentIndex()).orElseThrow(() -> new CustomException(CustomExceptionStatus.COMMENTID_INVALID));
        if (comment.getMember().getMemberIndex() == dto.getMemberIndex()) {
            commentRepository.delete(comment);
        } else {
            throw new CustomException(CustomExceptionStatus.MEMBERID_INVALID);
        }

    }

    public List<CommentListResponseDto> findCommentList(Long BoardIndex) {
        Board board = boardRepository.findByBoardIndex(BoardIndex)
                .orElseThrow(() -> new CustomException(CustomExceptionStatus.BOARDID_INVALID));

        List<CommentListResponseDto> list = new ArrayList<>();

        for (Comment c : board.getComments()) {

            List<MultiCommentListResponseDto> mList = new ArrayList<>();

            for (MultiComment m : c.getMultiComments()) {
                mList.add(MultiCommentListResponseDto.builder()
                        .memberIndex(m.getMember().getMemberIndex())
                        .memberNickname(m.getMember().getMemberNickname())
                        .multiCommentIndex(m.getMultiCommentIndex())
                        .multiCommentContent(m.getMultiCommentContent())
                        .multiCommentRegdate(m.getMultiCommentRegdate())
                        .build());
            }

            list.add(CommentListResponseDto.builder()
                    .memberIndex(c.getMember().getMemberIndex())
                    .memberNickname(c.getMember().getMemberNickname())
                    .commentIndex(c.getCommentIndex())
                    .commentContent(c.getCommentContent())
                    .commentRegdate(c.getCommentRegdate())
                    .multiComments(mList)
                    .build());
        }

        return list;
    }

}

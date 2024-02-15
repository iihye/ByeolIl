package com.stella.stella.report.service;

import com.stella.stella.board.dto.BoardReportRequestDto;
import com.stella.stella.board.entity.Board;
import com.stella.stella.board.entity.BoardDeleteYN;
import com.stella.stella.board.repository.BoardRepository;
import com.stella.stella.comment.dto.ReportResponseDto;
import com.stella.stella.common.exception.CustomException;
import com.stella.stella.common.exception.CustomExceptionStatus;
import com.stella.stella.member.entity.Member;
import com.stella.stella.member.repository.MemberRepository;
import com.stella.stella.report.entity.Report;
import com.stella.stella.report.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;

    public void addReport(BoardReportRequestDto dto) {
        if (reportRepository.countByBoardBoardIndexAndMemberMemberIndex(dto.getBoardIndex(), dto.getMemberIndex()) != 0)
            throw new CustomException(CustomExceptionStatus.ALREADY_REPORTED);
        Board board = boardRepository.findByBoardIndex(dto.getBoardIndex()).orElseThrow(() -> new CustomException(CustomExceptionStatus.BOARDID_INVALID));
        if (board.getBoardDeleteYN() == BoardDeleteYN.Y) {
            throw new CustomException(CustomExceptionStatus.BOARD_DELETED);
        }
        Member member = memberRepository.findByMemberIndex((dto.getMemberIndex())).orElseThrow(() -> new CustomException(CustomExceptionStatus.MEMBER_INVALID));

        Report report = Report.builder()
                .reportContent(dto.getReportContent())
                .board(board)
                .member(member)
                .build();

        reportRepository.save(report);
    }

    public List<ReportResponseDto> findReportList() {
        List<ReportResponseDto> list = new ArrayList<>();
        for (Report r : reportRepository.findAll()) {
            list.add(ReportResponseDto.builder()
                    .reportRegdate(r.getReportRegdate().format(DateTimeFormatter.ofPattern("yy.MM.dd")))
                    .reportIndex(r.getReportIndex())
                    .reportContent(r.getReportContent())
                    .boardIndex(r.getBoard().getBoardIndex())
                    .memberIndex(r.getMember().getMemberIndex())
                    .memberNickname(r.getMember().getMemberNickname())
                    .banMemberIndex(r.getBoard().getMember().getMemberIndex())
                    .banMemberNickName(r.getBoard().getMember().getMemberNickname())
                    .build());
        }
        return list;
    }

}

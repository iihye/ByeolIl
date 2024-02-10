package com.stella.stella.report.entity;

import com.stella.stella.board.entity.Board;
import com.stella.stella.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;

@EntityListeners(AuditingEntityListener.class)
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "report",
        uniqueConstraints = @UniqueConstraint(name = "UniqueReportSet", columnNames = {"board_index", "member_index"}))

public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_index", updatable = false)
    private Long reportIndex;

    @CreatedDate
    @Column(name = "report_regdate")
    private LocalDate reportRegdate;

    @Column(name = "report_content", length = 100)
    private String reportContent;

    @ManyToOne
    @JoinColumn(name = "board_index", referencedColumnName = "board_index")
    private Board board;

    @ManyToOne
    @JoinColumn(name = "member_index", referencedColumnName = "member_index")
    private Member member;

}

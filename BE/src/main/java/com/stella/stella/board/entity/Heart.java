package com.stella.stella.board.entity;

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
@Table(name = "heart",
        uniqueConstraints = @UniqueConstraint(name = "UniqueHeartSet", columnNames = {"board_index", "member_index"}))

public class Heart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "heart_index", updatable = false)
    private Long heartIndex;             //테이블 고유 번호

    @CreatedDate
    @Column(name = "heart_regdate")
    private LocalDate heartRegdate;      //좋아요 작성 날

    @ManyToOne
    @JoinColumn(name = "board_index", referencedColumnName = "board_index")
    private Board board;

    @ManyToOne
    @JoinColumn(name = "member_index", referencedColumnName = "member_index")
    private Member member;


}

package com.stella.stella.board.entity;

import com.stella.stella.comment.entity.Comment;
import com.stella.stella.member.entity.Member;
import com.stella.stella.report.entity.Report;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@EntityListeners(AuditingEntityListener.class)
//Auditing을 사용하면 자동으로 시간을 매핑해서 넣어줌
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_index", updatable = false)
    private Long boardIndex;            //게시글 고유 번호

    @CreatedDate
    @Column(name = "board_regtime")
    private LocalDateTime boardRegtime; //처음 등록 시점

    @LastModifiedDate
    @Column(name = "board_input_date")
    private LocalDate boardInputdate;   //사용자 입력 날짜(최근 수정 날짜)

    @Column(name = "board_content", nullable = false, length = 500)
    private String boardContent;        //게시글 내용

    @Column(name = "board_location")
    private Long boardLocation;         //하늘에서 별 위치

    @Column(name = "board_access", nullable = false, length = 10)
    private String boardAccess;         //게시글 접근 범위

    @ManyToOne(optional = false)
    @JoinColumn(name = "member_index", referencedColumnName = "member_index")
    private Member member;

    @OneToMany(mappedBy = "board", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private List<Report> reports = new ArrayList<>();

    @OneToMany(mappedBy = "board", cascade = CascadeType.REMOVE, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Heart> hearts = new ArrayList<>();

    @OneToMany(mappedBy = "board", cascade = CascadeType.REMOVE, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<Hash> hashes = new HashSet<>();

    @OneToMany(mappedBy = "board", cascade = CascadeType.REMOVE, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Comment> comments = new ArrayList<>();

    public void setBoardContent(String boardContent) {
        this.boardContent = boardContent;
    }

    public void setBoardLocation(Long boardLocation) {
        this.boardLocation = boardLocation;
    }

    public void setBoardAccess(String boardAccess) {
        this.boardAccess = boardAccess;
    }

    public void setReports(List<Report> reports) {
        this.reports = reports;
    }

    public void setLikes(List<Heart> likes) {
        this.hearts = hearts;
    }

    public void setHashes(Set<Hash> hashes) {
        this.hashes = hashes;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }


}

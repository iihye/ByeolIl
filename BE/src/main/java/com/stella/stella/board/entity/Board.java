package com.stella.stella.board.entity;

import com.stella.stella.comment.entity.Comment;
import com.stella.stella.member.entity.Member;
import com.stella.stella.radio.entity.Radio;
import com.stella.stella.report.entity.Report;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@EntityListeners(AuditingEntityListener.class)
//Auditing을 사용하면 자동으로 시간을 매핑해서 넣어줌
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@DynamicInsert
@DynamicUpdate
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_index", updatable = false)
    private Long boardIndex;            //게시글 고유 번호

    @CreatedDate
    @Column(name = "board_regtime")
    private LocalDateTime boardRegtime; //처음 등록 시점

    @LastModifiedDate
    @Column(name = "board_update_date")
    private LocalDateTime boardUpdateDate; //(최근 수정 날짜)

    @Column(name = "board_input_date")
    private LocalDate boardInputDate;   //사용자 입력 날짜

    @Column(name = "board_content", nullable = false, length = 500)
    private String boardContent;        //게시글 내용

    @Column(name = "board_location")
    private Long boardLocation;         //하늘에서 별 위치

    @Column(name = "board_access", length = 10)
    @Enumerated(EnumType.STRING)
    @ColumnDefault("'OPEN'")
    private BoardAccessStatus boardAccess;         //게시글 접근 범위

    @Column(name = "delete_yn")
    @Enumerated(EnumType.STRING)
    @ColumnDefault("'N'")
    private BoardDeleteYN boardDeleteYN;

    @ManyToOne(optional = false)
    @JoinColumn(name = "member_index", referencedColumnName = "member_index")
    private Member member;

    @OneToMany(mappedBy = "board", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private List<Report> reports ;

    @OneToMany(mappedBy = "board", cascade = CascadeType.REMOVE, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Heart> hearts ;

    @OneToMany(mappedBy = "board", cascade = CascadeType.REMOVE, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<Hash> hashes ;

    @OneToMany(mappedBy = "board", cascade = CascadeType.REMOVE, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Comment> comments ;

    @OneToMany(mappedBy = "board", cascade = CascadeType.REMOVE, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Media> medias;

    public void setBoardContent(String boardContent) {
        this.boardContent = boardContent;
    }

    public void setBoardLocation(Long boardLocation) {
        this.boardLocation = boardLocation;
    }

    public void setReports(List<Report> reports) {
        this.reports = reports;
    }

    public void setHearts(List<Heart> hearts) {
        this.hearts = hearts;
    }

    public void setHashes(Set<Hash> hashes) {
        this.hashes = hashes;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public void setBoardAccess(BoardAccessStatus boardAccess) {
        this.boardAccess = boardAccess;
    }

    public void setBoardDeleteYN(BoardDeleteYN boardDeleteYN) {
        this.boardDeleteYN = boardDeleteYN;
    }

    public void setBoardInputDate(LocalDate boardInputDate) {
        this.boardInputDate = boardInputDate;
    }

    public Radio toRadio(){
        return Radio.builder()
                .fromMember(this.getMember())
                .toMember(this.getMember())
                .board(this)
        .build();
    }
}

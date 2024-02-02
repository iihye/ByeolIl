
package com.stella.stella.comment.entity;

import com.stella.stella.board.entity.Board;
import com.stella.stella.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@EntityListeners(AuditingEntityListener.class)
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_index", updatable = false)
    private Long commentIndex;                  //댓글 고유 번호

    @CreatedDate
    @Column(name = "comment_regdate")
    private LocalDateTime commentRegdate;           //댓글 등록 날짜

    @Column(name = "comment_content", length = 200)
    private String commentContent;              //댓글 내용

    @ManyToOne
    @JoinColumn(name = "member_index", referencedColumnName = "member_index")
    private Member member;

    @ManyToOne
    @JoinColumn(name = "board_index", referencedColumnName = "board_index")
    private Board board;

    @OneToMany(mappedBy = "comment", cascade = CascadeType.ALL)
    private List<MultiComment> multiComments ;

    public void setCommentContent(String commentContent) {
        this.commentContent = commentContent;
    }

    public void setMultiComments(List<MultiComment> multiComments) {
        this.multiComments = multiComments;
    }
}

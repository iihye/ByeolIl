package com.stella.stella.comment.entity;

import com.stella.stella.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@EntityListeners(AuditingEntityListener.class)
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class MultiComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "multicomment_index", updatable = false)
    private Long multiCommentIndex;                 //대댓글 고유 번호

    @CreatedDate
    @Column(name = "multicomment_regdate")
    private LocalDateTime multiCommentRegdate;          //대댓글 등록 시점

    @Column(name = "multicomment_content", length = 200)
    private String multiCommentContent;

    @ManyToOne
    @JoinColumn(name = "comment_index", referencedColumnName = "comment_index")
    private Comment comment;                        //댓글 고유 번호

    @ManyToOne
    @JoinColumn(name = "member_index", referencedColumnName = "member_index")
    private Member member;

    public void setMultiCommentContent(String multiCommentContent) {
        this.multiCommentContent = multiCommentContent;
    }
}

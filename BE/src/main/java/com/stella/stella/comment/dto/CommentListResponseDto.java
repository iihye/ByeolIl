package com.stella.stella.comment.dto;

import com.stella.stella.comment.entity.Comment;
import com.stella.stella.comment.entity.MultiComment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentListResponseDto {
    private Long memberIndex;
    private Long commentIndex;
    private String commentContent;
    private LocalDateTime commentRegdate;
    private List<MultiCommentListResponseDto> multiComments;
}

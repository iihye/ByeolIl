package com.stella.stella.comment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentListResponseDto {
    private Long memberIndex;
    private String memberNickname;
    private Long commentIndex;
    private String commentContent;
    private LocalDateTime commentRegdate;
    private List<MultiCommentListResponseDto> multiComments;
}

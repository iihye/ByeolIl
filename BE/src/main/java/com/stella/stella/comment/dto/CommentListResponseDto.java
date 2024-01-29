package com.stella.stella.comment.dto;

import com.stella.stella.comment.entity.Comment;
import com.stella.stella.comment.entity.MultiComment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentListResponseDto {
    private String commentContent;
    private List<MultiCommentListResponseDto> multiComments;
}

package com.stella.stella.comment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MultiCommentListResponseDto {
    private Long memberIndex;
    private String memberNickname;
    private Long multiCommentIndex;
    private String multiCommentContent;
    private LocalDateTime multiCommentRegdate;
}

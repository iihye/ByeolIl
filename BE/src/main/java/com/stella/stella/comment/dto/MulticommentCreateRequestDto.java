package com.stella.stella.comment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MulticommentCreateRequestDto {
    private Long commentIndex;
    private Long boardIndex;
    private Long memberIndex;
    private String commentContent;
}

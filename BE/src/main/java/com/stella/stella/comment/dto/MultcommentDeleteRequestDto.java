package com.stella.stella.comment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MultcommentDeleteRequestDto {
    private Long multcommentIndex;
    private Long memberIndex;
}

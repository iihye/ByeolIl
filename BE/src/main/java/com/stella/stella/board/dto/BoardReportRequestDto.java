package com.stella.stella.board.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardReportRequestDto {
    private Long boardIndex;
    private Long memberIndex;
    private String reportContent;
}

package com.stella.stella.board.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardCreateRequestDto {

    private Long memberIndex;
    private String boardContent;
    private LocalDate boardInputDate;
    private List<String> mediaContent;
    private String boardAccess;
    private Long boardLocation;
    private List<String> hashContent;
}

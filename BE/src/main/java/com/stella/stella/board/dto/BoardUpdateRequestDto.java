package com.stella.stella.board.dto;

import com.stella.stella.board.entity.BoardAccessStatus;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardUpdateRequestDto {

    private Long boardIndex;
    private Long memberIndex;
    private LocalDate boardInputDate;
    private String boardContent;
    private List<String> boardMedia;
    private String boardAccess;
    private List<String> boardHash;
}

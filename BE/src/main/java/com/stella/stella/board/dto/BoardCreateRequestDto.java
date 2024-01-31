package com.stella.stella.board.dto;

import com.stella.stella.board.entity.BoardAccessStatus;
import com.stella.stella.board.entity.BoardDeleteYN;
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
    private Long boardLocation;
    private BoardAccessStatus boardAccess;
    private BoardDeleteYN boardDeleteYN;
    private List<String> hashContent;
}

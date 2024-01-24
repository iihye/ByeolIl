package com.stella.stella.board.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardListResponseDto {


    private int boardIndex;
    private int userIndex;
    private LocalDateTime boardRegTime;
    private LocalDateTime boardInputDate;
    private  String boardContent;
    private  int boardLocation;
    private  String boardAccess;
    private  int boardLike;
    private List<String> tagContent;
}

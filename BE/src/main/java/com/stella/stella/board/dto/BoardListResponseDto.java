package com.stella.stella.board.dto;

import com.stella.stella.board.entity.BoardAccessStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardListResponseDto {


    private Long boardIndex;
    private Long memberIndex;
    private LocalDateTime boardRegTime;
    private LocalDateTime boardUpdateDate;
    private LocalDate boardInputDate;
    private  String boardContent;
    private  Long boardLocation;
    private BoardAccessStatus boardAccess;
    private  int boardHeart;
    private List<String> Hash;
}

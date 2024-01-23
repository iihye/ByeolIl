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
public class BoardStarResponseDto {
    private LocalDateTime boardRegtime;
   private LocalDateTime boardInputDate;
   private String boardContent;
   private List<String> boardMedia;
   private BoardAccessStatus boardAccess;
   private int boardLike;
  private List<String> hashContent;


}

package com.stella.stella.board.dto;

import com.stella.stella.board.entity.BoardAccessStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class BoardStarResponseDto {
    private LocalDate boardInputDate;
   private String boardContent;
   private List<String> boardMedia;
   private BoardAccessStatus boardAccess;
   private int boardLike;
  private List<String> hashContent;

    public BoardStarResponseDto(LocalDate boardInputDate, String boardContent, List<String> boardMedia, BoardAccessStatus boardAccess, int boardLike, List<String> hashContent) {
        this.boardInputDate = boardInputDate;
        this.boardContent = boardContent;
        this.boardMedia = boardMedia;
        this.boardAccess = boardAccess;
        this.boardLike = boardLike;
        this.hashContent = hashContent;
    }
}

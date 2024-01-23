package com.stella.stella.board.dto;

import lombok.Getter;

import java.time.LocalDate;

@Getter
public class BoardUpdateRequestDto {

    private Long boardIndex;
    private Long userIndex;
    private LocalDate boardInputDate;
    private String boardContent;
    private String boardPicture;
    private String boardAccess;

    public BoardUpdateRequestDto(Long boardIndex, Long userIndex, LocalDate boardInputDate, String boardContent, String boardPicture, String boardAccess) {
        this.boardIndex = boardIndex;
        this.userIndex = userIndex;
        this.boardInputDate = boardInputDate;
        this.boardPicture = boardPicture;
        this.boardContent = boardContent;
        this.boardAccess = boardAccess;
    }
}

package com.stella.stella.board.dto;

import com.stella.stella.board.entity.BoardAccessStatus;
import lombok.Getter;

import java.util.List;

@Getter
public class BoardCreateRequestDto {

    private Long userIndex;
    private String boardContent;
    private String boardMediaLocation;
    private Long boardLocation;
    private BoardAccessStatus boardAccess;
    private List<String> hashContent;

    public BoardCreateRequestDto(Long userIndex, String boardContent, String boardMediaLocation, Long boardLocation, BoardAccessStatus boardAccess, List<String> hashContent) {
        this.userIndex = userIndex;
        this.boardContent = boardContent;
        this.boardMediaLocation = boardMediaLocation;
        this.boardLocation = boardLocation;
        this.boardAccess = boardAccess;
        this.hashContent = hashContent;
    }
}

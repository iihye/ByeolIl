package com.stella.stella.board.dto;

import com.stella.stella.board.entity.BoardAccessStatus;
import com.stella.stella.board.entity.BoardDeleteYN;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardCreateRequestDto {

    private Long userIndex;
    private String boardContent;
    private List<String> boardMedia;
    private Long boardLocation;
    private BoardAccessStatus boardAccess;
    private BoardDeleteYN boardDeleteYN;
    private List<String> hashContent;
}

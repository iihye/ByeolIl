package com.stella.stella.board.dto;

import com.stella.stella.board.entity.BoardAccessStatus;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardStarResponseDto {
    private String boardRegtime;
    private String boardInputDate;
    private String boardUpdateDate;
    private String boardContent;
    private List<String> boardMedia;
    private BoardAccessStatus boardAccess;
    private int boardLike;
    private boolean alreadyHeartedTF;
    private List<String> hashContent;


}

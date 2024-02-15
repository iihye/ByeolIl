package com.stella.stella.board.dto;

import com.stella.stella.board.entity.Board;
import com.stella.stella.board.entity.BoardAccessStatus;
import lombok.*;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardListResponseDto {


    private Long boardIndex;
    private Long memberIndex;
    private String memberNickname;
    private String boardRegTime;
    private String boardUpdateDate;
    private String boardInputDate;
    private String boardContent;
    private Long boardLocation;
    private BoardAccessStatus boardAccess;
    private int boardHeart;
    private List<String> Hash;

    public static List<BoardListResponseDto> wrap(Long memberIndex, List<Board> list) {
        List<BoardListResponseDto> dtoList = new ArrayList<>();
        for (Board b : list) {
            dtoList.add(BoardListResponseDto.builder()
                    .boardIndex(b.getBoardIndex())
                    .memberIndex(b.getMember().getMemberIndex())
                    .memberNickname(b.getMember().getMemberNickname())
                    .boardRegTime(b.getBoardRegtime().format(DateTimeFormatter.ofPattern("yy.MM.dd HH:mm")))
                    .boardUpdateDate(b.getBoardUpdateDate().format(DateTimeFormatter.ofPattern("yy.MM.dd HH:mm")))
                    .boardInputDate(b.getBoardInputDate().format(DateTimeFormatter.ofPattern("yy.MM.dd")))
                    .boardContent(b.getBoardContent())
                    .boardLocation(b.getBoardLocation())
                    .boardAccess(b.getBoardAccess())
                    .boardHeart(b.getHearts().size())
                    .Hash(b.getHashes().stream().map(com.stella.stella.board.entity.Hash::getHashContent).toList()).build());
        }
        return dtoList;
    }

    public static List<BoardListResponseDto> getSearchList(List<Board> list) {
        List<BoardListResponseDto> dtoList = new ArrayList<>();
        for (Board b : list) {
            dtoList.add(BoardListResponseDto.builder()
                    .boardIndex(b.getBoardIndex())
                    .memberIndex(b.getMember().getMemberIndex())
                    .memberNickname(b.getMember().getMemberNickname())
                    .boardRegTime(b.getBoardRegtime().format(DateTimeFormatter.ofPattern("yy.MM.dd HH:mm")))
                    .boardUpdateDate(b.getBoardUpdateDate().format(DateTimeFormatter.ofPattern("yy.MM.dd HH:mm")))
                    .boardInputDate(b.getBoardInputDate().format(DateTimeFormatter.ofPattern("yy.MM.dd")))
                    .boardContent(b.getBoardContent())
                    .boardLocation(b.getBoardLocation())
                    .boardAccess(b.getBoardAccess())
                    .boardHeart(b.getHearts().size())
                    .Hash(b.getHashes().stream().map(com.stella.stella.board.entity.Hash::getHashContent).toList()).build());
        }
        return dtoList;
    }
}

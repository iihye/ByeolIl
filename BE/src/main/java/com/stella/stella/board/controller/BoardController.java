package com.stella.stella.board.controller;

import com.stella.stella.board.dto.BoardCreateRequestDto;
import com.stella.stella.board.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/board")
@RequiredArgsConstructor
public class BoardController {

    @Autowired
    private final BoardService boardService;

    @PostMapping("")
    public void saveBoard(@RequestBody BoardCreateRequestDto boardCreateRequestDto){
        boardService.createBoard(boardCreateRequestDto);
    }
}

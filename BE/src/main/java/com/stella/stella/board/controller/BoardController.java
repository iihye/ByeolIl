package com.stella.stella.board.controller;

import com.stella.stella.board.dto.BoardCreateRequestDto;
import com.stella.stella.board.dto.BoardStarResponseDto;
import com.stella.stella.board.dto.BoardUpdateRequestDto;
import com.stella.stella.board.service.BoardService;
import com.stella.stella.member.dto.MyInfoResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/board")
    @RequiredArgsConstructor
    public class BoardController {

        @Autowired
        private final BoardService boardService;

        @PostMapping("/")
        public void saveBoard(@RequestBody BoardCreateRequestDto boardCreateRequestDto){
        boardService.createBoard(boardCreateRequestDto);
        }

        @GetMapping("/{boardId}")
        public ResponseEntity<BoardStarResponseDto> findBoard(@PathVariable Long boardId){
            HttpStatus status = HttpStatus.OK;
            BoardStarResponseDto dto = null;
            try{
                dto= boardService.showBoardDetail(boardId);

            } catch(NullPointerException e) {
                status = HttpStatus.NOT_FOUND;
            } catch(Exception e) {
                status = HttpStatus.BAD_REQUEST;
            }
            return ResponseEntity.status(status).body(dto);

        }

        
}

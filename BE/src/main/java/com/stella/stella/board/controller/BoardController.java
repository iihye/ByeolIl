package com.stella.stella.board.controller;

import com.stella.stella.board.dto.*;
import com.stella.stella.board.service.BoardService;
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
    public ResponseEntity<ResultResponseDto> saveBoard(@RequestBody BoardCreateRequestDto boardCreateRequestDto) {
        HttpStatus status = HttpStatus.OK;
        String message = "success";
        try {
            boardService.createBoard(boardCreateRequestDto);
        } catch (NullPointerException e) {
            status = HttpStatus.NOT_FOUND;
            message = "fail";
        } catch (Exception e) {
            status = HttpStatus.BAD_REQUEST;
            message = "fail";
        }
        return ResponseEntity.status(status).body(new ResultResponseDto(message));
    }

    @GetMapping("/{boardIndex}")
    public ResponseEntity<BoardStarResponseDto> findBoard(@PathVariable Long boardIndex) {
        HttpStatus status = HttpStatus.OK;
        BoardStarResponseDto dto = null;
        try {
            dto = boardService.showBoardDetail(boardIndex);

        } catch (NullPointerException e) {
            status = HttpStatus.NOT_FOUND;
        } catch (Exception e) {
            status = HttpStatus.BAD_REQUEST;
        }
        return ResponseEntity.status(status).body(dto);

    }

    @PutMapping("/")
    public ResponseEntity<ResultResponseDto> updateBoard(@RequestBody BoardUpdateRequestDto boardUpdateRequestDto) {
        HttpStatus status = HttpStatus.OK;
        String message = "success";
        try {
            boardService.updateBoard(boardUpdateRequestDto);
        } catch (NullPointerException e) {
            status = HttpStatus.NOT_FOUND;
            message = "fail";
        } catch (Exception e) {
            status = HttpStatus.BAD_REQUEST;
            message = "fail";
        }
        return ResponseEntity.status(status).body(new ResultResponseDto(message));
    }
    @DeleteMapping("/")
    public ResponseEntity<ResultResponseDto> deleteBoard(@RequestBody BoardDeleteRequestDto boardDeleteRequestDto){
        HttpStatus status = HttpStatus.OK;
        String message = "success";
        try {
            boardService.deleteBoard(boardDeleteRequestDto);
        } catch (NullPointerException e) {
            status = HttpStatus.NOT_FOUND;
            message = "fail";
        } catch (Exception e) {
            status = HttpStatus.BAD_REQUEST;
            message = "fail";
        }
        return ResponseEntity.status(status).body(new ResultResponseDto(message));
    }
}

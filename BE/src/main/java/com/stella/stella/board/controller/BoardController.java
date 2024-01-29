package com.stella.stella.board.controller;

import com.stella.stella.board.dto.*;
import com.stella.stella.board.entity.Board;
import com.stella.stella.board.service.BoardService;
import com.stella.stella.board.service.HeartService;
import com.stella.stella.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;
    private final HeartService heartService;
    private final ReportService reportService;

    @PostMapping("/")
    public ResponseEntity<ResultResponseDto> boardAdd(@RequestBody BoardCreateRequestDto boardCreateRequestDto) {
        HttpStatus status = HttpStatus.OK;
        String message = "success";
        try {
            boardService.addBoard(boardCreateRequestDto);
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
    public ResponseEntity<BoardStarResponseDto> boardDetails (@PathVariable Long boardIndex) {
        HttpStatus status = HttpStatus.OK;
        BoardStarResponseDto dto = null;
        try {
            dto = boardService.findBoard(boardIndex);

        } catch (NullPointerException e) {
            status = HttpStatus.NOT_FOUND;
        } catch (Exception e) {
            status = HttpStatus.BAD_REQUEST;
        }
        return ResponseEntity.status(status).body(dto);

    }

    @PutMapping("/")
    public ResponseEntity<ResultResponseDto> boardModify(@RequestBody BoardUpdateRequestDto boardUpdateRequestDto) {
        HttpStatus status = HttpStatus.OK;
        String message = "success";
        try {
            boardService.modifyBoard(boardUpdateRequestDto);
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
    public ResponseEntity<ResultResponseDto> boardRemove(@RequestBody BoardDeleteRequestDto boardDeleteRequestDto) {
        HttpStatus status = HttpStatus.OK;
        String message = "success";
        try {
            boardService.removeBoard(boardDeleteRequestDto);
        } catch (NullPointerException e) {
            status = HttpStatus.NOT_FOUND;
            message = "fail";
        } catch (Exception e) {
            status = HttpStatus.BAD_REQUEST;
            message = "fail";
        }
        return ResponseEntity.status(status).body(new ResultResponseDto(message));
    }


    @GetMapping("/star/{memberIndex}")
    public ResponseEntity<Map<String, Object>> boardListToStar(@PathVariable Long memberIndex, @PageableDefault(size = 100, sort = "boardLocation", direction = Sort.Direction.ASC) Pageable pageable) {
        Map<String, Object> responseBody = new HashMap<>();
        HttpStatus status = HttpStatus.OK;
        try {
            responseBody = boardService.findBoardList(memberIndex, pageable);

        } catch (Exception e) {
            status = HttpStatus.BAD_REQUEST;
            responseBody.put("error", e.getMessage());
        }
        return ResponseEntity.status(status).body(responseBody);
    }

    @GetMapping("/list/{memberIndex}")

    public ResponseEntity<Map<String, Object>> boardListToList(@PathVariable Long memberIndex, @PageableDefault(size = 5, sort = "boardInputDate", direction = Sort.Direction.ASC) Pageable pageable) {
        Map<String, Object> responseBody = new HashMap<>();
        HttpStatus status = HttpStatus.OK;
        try {
            responseBody = boardService.findBoardList(memberIndex, pageable);

        } catch (Exception e) {
            status = HttpStatus.BAD_REQUEST;
            responseBody.put("error", e.getMessage());
        }
        return ResponseEntity.status(status).body(responseBody);
    }


    @GetMapping("/like/{memberIndex}")
    public ResponseEntity<Map<String, Object>> heartedBoardList(@PathVariable Long memberIndex, @PageableDefault(size = 5, sort = "boardInputDate", direction = Sort.Direction.ASC) Pageable pageable){
        Map<String, Object> responseBody = new HashMap<>();
        HttpStatus status = HttpStatus.OK;
        try {
            responseBody = boardService.findHeartedBoardList(memberIndex, pageable);

        } catch (Exception e) {
            status = HttpStatus.BAD_REQUEST;
            responseBody.put("error", e.getMessage());
        }
        return ResponseEntity.status(status).body(responseBody);
    }

    @PostMapping("/like")
    public ResponseEntity<ResultResponseDto> heartAdd(@RequestBody HeartRequestDto heartRequestDto){
        HttpStatus status = HttpStatus.OK;
        String message = "success";

        try{
            heartService.addHeart(heartRequestDto);
        }catch (NullPointerException e) {
            status = HttpStatus.NOT_FOUND;
            message = "fail";
        } catch (Exception e) {
        status = HttpStatus.BAD_REQUEST;
        message = "fail";
    }

        return ResponseEntity.status(status).body(new ResultResponseDto(message));
    }
    @DeleteMapping("/like")
    public ResponseEntity<ResultResponseDto> heartRemove(@RequestBody HeartRequestDto heartRequestDto){
        HttpStatus status = HttpStatus.OK;
        String message = "success";

        try{
            heartService.removeHeart(heartRequestDto);
        }catch (NullPointerException e) {
            status = HttpStatus.NOT_FOUND;
            message = "fail";
        } catch (Exception e) {
            status = HttpStatus.BAD_REQUEST;
            message = "fail";
        }

        return ResponseEntity.status(status).body(new ResultResponseDto(message));
    }
    @PostMapping("/report")
    public ResponseEntity<ResultResponseDto> reportAdd(@RequestBody BoardReportRequestDto boardReportRequestDto){
        HttpStatus status = HttpStatus.OK;
        String message = "success";

        try{
            reportService.addReport(boardReportRequestDto);
        }catch (NullPointerException e) {
            status = HttpStatus.NOT_FOUND;
            message = "fail";
        } catch (Exception e) {
            status = HttpStatus.BAD_REQUEST;
            message = "fail";
        }

        return ResponseEntity.status(status).body(new ResultResponseDto(message));
    }
}

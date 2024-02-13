package com.stella.stella.board.controller;

import com.stella.stella.board.dto.*;
import com.stella.stella.board.service.BoardService;
import com.stella.stella.board.service.HeartService;
import com.stella.stella.comment.dto.ReportResponseDto;
import com.stella.stella.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;
    private final HeartService heartService;
    private final ReportService reportService;


    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ResultResponseDto> boardAdd(@RequestPart(value = "requestDto") BoardCreateRequestDto boardCreateRequestDto,
                                                      @RequestPart(value = "files",required = false) MultipartFile[] files) {
        HttpStatus status = HttpStatus.OK;
        String message = "success";
        try {
            boardService.addBoard(boardCreateRequestDto, files);
        } catch (NullPointerException e) {
            status = HttpStatus.NOT_FOUND;
            message = e.getMessage();
        } catch (Exception e) {
            status = HttpStatus.BAD_REQUEST;
            message = e.getMessage();
        }
        return ResponseEntity.status(status).body(new ResultResponseDto(message));
    }

    @GetMapping("/{boardIndex}/{memberIndex}")
    public ResponseEntity<BoardStarResponseDto> boardDetails (@PathVariable Long boardIndex, @PathVariable Long memberIndex) {
        HttpStatus status = HttpStatus.OK;
        BoardStarResponseDto dto = null;
        try {
            dto = boardService.findBoard(boardIndex,memberIndex);

        } catch (NullPointerException e) {
            status = HttpStatus.NOT_FOUND;
        } catch (Exception e) {
            status = HttpStatus.BAD_REQUEST;
        }
        return ResponseEntity.status(status).body(dto);

    }

    @PutMapping(consumes = "multipart/form-data")
    public ResponseEntity<ResultResponseDto> boardModify(@RequestPart(value = "requestDto") BoardUpdateRequestDto boardUpdateRequestDto
    ,@RequestPart(value = "files",required = false) MultipartFile[] files) {
        HttpStatus status = HttpStatus.OK;
        String message = "success";
        try {
            boardService.modifyBoard(boardUpdateRequestDto,files);
        } catch (NullPointerException e) {
            status = HttpStatus.NOT_FOUND;
            message = e.getMessage();
        } catch (Exception e) {
            status = HttpStatus.BAD_REQUEST;
            message = e.getMessage();
        }
        return ResponseEntity.status(status).body(new ResultResponseDto(message));
    }

    @PutMapping("/delete")
    public ResponseEntity<ResultResponseDto> boardRemove(@RequestBody BoardDeleteRequestDto boardDeleteRequestDto) {
        HttpStatus status = HttpStatus.OK;
        String message = "success";
        try {
            boardService.removeBoard(boardDeleteRequestDto);
        } catch (NullPointerException e) {
            status = HttpStatus.NOT_FOUND;
            message = e.getMessage();
        } catch (Exception e) {
            status = HttpStatus.BAD_REQUEST;
            message = e.getMessage();

        }
        return ResponseEntity.status(status).body(new ResultResponseDto(message));
    }
    @GetMapping("/star/{memberIndex}")
    public ResponseEntity<List<BoardListResponseDto>> boardListToStar(@PathVariable Long memberIndex, Long page) {
        List<BoardListResponseDto> list = new ArrayList();
        HttpStatus status = HttpStatus.OK;
        try {
            list = boardService.findBoardListToPage(memberIndex, page);

        } catch (Exception e) {
            status = HttpStatus.BAD_REQUEST;
        }
        return ResponseEntity.status(status).body(list);
    }

    @GetMapping("/list/{memberIndex}")

    public ResponseEntity<List<BoardListResponseDto>> boardListToList(@PathVariable Long memberIndex) {
        List<BoardListResponseDto> list = new ArrayList();
        HttpStatus status = HttpStatus.OK;
        try {
            list = boardService.findBoardListToList(memberIndex);

        } catch (Exception e) {
            status = HttpStatus.BAD_REQUEST;

        }
        return ResponseEntity.status(status).body(list);
    }


    @GetMapping("/like/{memberIndex}")
    public ResponseEntity<List<BoardListResponseDto>> heartedBoardList(@PathVariable Long memberIndex){
        List<BoardListResponseDto> list = new ArrayList();
        HttpStatus status = HttpStatus.OK;
        try {
            list = boardService.findHeartedBoardList(memberIndex);

        } catch (Exception e) {
            status = HttpStatus.BAD_REQUEST;
        }
        return ResponseEntity.status(status).body(list);
    }

    @PostMapping("/like")
    public ResponseEntity<ResultResponseDto> heartAdd(@RequestBody HeartRequestDto heartRequestDto){
        HttpStatus status = HttpStatus.OK;
        String message = "success";

        try{
            heartService.addHeart(heartRequestDto);
        }catch (NullPointerException e) {
            status = HttpStatus.NOT_FOUND;
            message = e.getMessage();
        } catch (Exception e) {
        status = HttpStatus.BAD_REQUEST;
        message = e.getMessage();
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
            message = e.getMessage();
        } catch (Exception e) {
            status = HttpStatus.BAD_REQUEST;
            message = e.getMessage();
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
            message = e.getMessage();
        } catch (Exception e) {
            status = HttpStatus.BAD_REQUEST;
            message = e.getMessage();
        }

        return ResponseEntity.status(status).body(new ResultResponseDto(message));
    }

    @GetMapping("/adminlist")
    public ResponseEntity<List<ReportResponseDto>> reportList(){
        HttpStatus status = HttpStatus.OK;
        String message = "success";
        List<ReportResponseDto> list = new ArrayList<>();
        try{
            list = reportService.findReportList();
        }catch (NullPointerException e) {
            status = HttpStatus.NOT_FOUND;
            message = "fail";
        } catch (Exception e) {
            status = HttpStatus.BAD_REQUEST;
            message = "fail";
        }

        return ResponseEntity.status(status).body(list);
    }

    @GetMapping("/adminstar/{boardIndex}/{memberIndex}")
    public ResponseEntity<BoardStarResponseDto> reportDetails (@PathVariable Long boardIndex, @PathVariable Long memberIndex) {
        HttpStatus status = HttpStatus.OK;
        BoardStarResponseDto dto = null;
        try {
            dto = boardService.findBoardReport(boardIndex,memberIndex);

        } catch (NullPointerException e) {
            status = HttpStatus.NOT_FOUND;
        } catch (Exception e) {
            status = HttpStatus.BAD_REQUEST;
        }
        return ResponseEntity.status(status).body(dto);

    }
}

package com.stella.stella.board.controller;

import com.stella.stella.board.dto.*;
import com.stella.stella.board.entity.Board;
import com.stella.stella.board.service.BoardService;
import com.stella.stella.board.service.HeartService;
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
    public ResponseEntity<ResultResponseDto> deleteBoard(@RequestBody BoardDeleteRequestDto boardDeleteRequestDto) {
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


    @GetMapping("/star/{memberIndex}")
    public ResponseEntity<Map<String, Object>> findAllBoardToStar(@PathVariable Long memberIndex, @PageableDefault(size = 100, sort = "boardLocation", direction = Sort.Direction.ASC) Pageable pageable) {
        Map<String, Object> responseBody = new HashMap<>();
        HttpStatus status = HttpStatus.OK;
        List<BoardListResponseDto> list = new ArrayList<>();
        try {
            Page<Board> boards = boardService.showAllBoard(memberIndex, pageable);
            responseBody.put("totalPage", boards.getTotalPages());
            //총 페이지 넘버
            responseBody.put("previousPageNumber", boards.previousOrFirstPageable().getPageNumber());
            //이전이 있으면 이전 페이지 넘버, 없으면 현재 넘버
            responseBody.put("nextPageNumber", boards.nextOrLastPageable().getPageNumber());
            //다음이 있으면 다음 페이지 넘버, 없으면 현재 넘버
            list = BoardListResponseDto.wrap(memberIndex, boards.getContent());
            responseBody.put("BoardListResponseDtoList", list);
        } catch (Exception e) {
            status = HttpStatus.BAD_REQUEST;
            responseBody.put("error", e.getMessage());
        }
        return ResponseEntity.status(status).body(responseBody);
    }

    @GetMapping("/list/{memberIndex}")

    public ResponseEntity<Map<String, Object>> findAllBoardtoList(@PathVariable Long memberIndex, @PageableDefault(size = 5, sort = "boardInputDate", direction = Sort.Direction.ASC) Pageable pageable) {
        Map<String, Object> responseBody = new HashMap<>();
        HttpStatus status = HttpStatus.OK;
        List<BoardListResponseDto> list = new ArrayList<>();
        try {
            Page<Board> boards = boardService.showAllBoard(memberIndex, pageable);
            responseBody.put("totalPage", boards.getTotalPages());
            responseBody.put("previousPageNumber", boards.previousOrFirstPageable().getPageNumber());
            responseBody.put("nextPageNumber", boards.nextOrLastPageable().getPageNumber());
            list = BoardListResponseDto.wrap(memberIndex, boards.getContent());
            responseBody.put("BoardListResponseDtoList", list);
        } catch (Exception e) {
            status = HttpStatus.BAD_REQUEST;
            responseBody.put("error", e.getMessage());
        }
        return ResponseEntity.status(status).body(responseBody);
    }


    @GetMapping("/like/{memberIndex}")
    public ResponseEntity<Map<String, Object>> findMyHeartBoard(@PathVariable Long memberIndex, @PageableDefault(size = 5, sort = "boardInputDate", direction = Sort.Direction.ASC) Pageable pageable){
        Map<String, Object> responseBody = new HashMap<>();
        HttpStatus status = HttpStatus.OK;
        List<BoardListResponseDto> list = new ArrayList<>();
        try {
            Page<Board> boards = boardService.showMyHeartBoard(memberIndex, pageable);
            responseBody.put("totalPage", boards.getTotalPages());
            responseBody.put("previousPageNumber", boards.previousOrFirstPageable().getPageNumber());
            responseBody.put("nextPageNumber", boards.nextOrLastPageable().getPageNumber());
            list = BoardListResponseDto.wrap(memberIndex, boards.getContent());
            responseBody.put("BoardListResponseDtoList", list);
        } catch (Exception e) {
            status = HttpStatus.BAD_REQUEST;
            responseBody.put("error", e.getMessage());
        }
        return ResponseEntity.status(status).body(responseBody);
    }

    @PostMapping("/like")
    public ResponseEntity<ResultResponseDto> saveHeart(@RequestBody HeartRequestDto heartRequestDto){
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
    public ResponseEntity<ResultResponseDto> deleteHeart(@RequestBody HeartRequestDto heartRequestDto){
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

}

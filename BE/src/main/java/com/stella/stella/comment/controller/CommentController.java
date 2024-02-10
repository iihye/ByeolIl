package com.stella.stella.comment.controller;

import com.stella.stella.board.dto.ResultResponseDto;
import com.stella.stella.comment.dto.CommentCreateRequestDto;
import com.stella.stella.comment.dto.CommentDeleteRequestDto;
import com.stella.stella.comment.dto.CommentListResponseDto;
import com.stella.stella.comment.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/comment")
@Slf4j
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<ResultResponseDto> commendAdd(@RequestBody CommentCreateRequestDto commentCreateRequestDto){
        HttpStatus status = HttpStatus.OK;
        String message = "success";
        try{
            commentService.addComment(commentCreateRequestDto);
        }catch (Exception e){
            status = HttpStatus.BAD_REQUEST;
            message = "fail";
        }
        return ResponseEntity.status(status).body(new ResultResponseDto(message));
    }

    @DeleteMapping
    public ResponseEntity<ResultResponseDto> commentRemove(@RequestBody CommentDeleteRequestDto commentDeleteRequestDto){
        HttpStatus status = HttpStatus.OK;
        String message = "success";
        try{
            commentService.removeComment(commentDeleteRequestDto);
        }catch (Exception e){
            status = HttpStatus.BAD_REQUEST;
            message = "fail";
        }
        return ResponseEntity.status(status).body(new ResultResponseDto(message));

    }

    @GetMapping("/{boardIndex}")
    public ResponseEntity<List<CommentListResponseDto>> commentList(@PathVariable Long boardIndex){
        HttpStatus status = HttpStatus.OK;
        String message = "success";
        List<CommentListResponseDto> list=new ArrayList<>();
        try{
            list = commentService.findCommentList(boardIndex);
        }catch (Exception e){
            status = HttpStatus.BAD_REQUEST;
            message = "fail";
        }
        return ResponseEntity.status(status).body(list);
    }


}

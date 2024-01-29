package com.stella.stella.comment.controller;

import com.stella.stella.board.dto.ResultResponseDto;
import com.stella.stella.comment.dto.CommentCreateRequestDto;
import com.stella.stella.comment.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/comment")
@Slf4j
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/")
    public ResponseEntity<ResultResponseDto> createComment(@RequestBody CommentCreateRequestDto commentCreateRequestDto){
        HttpStatus status = HttpStatus.OK;
        String message = "success";
        System.out.println("try 밖");
        try{
            commentService.saveComment(commentCreateRequestDto);
            System.out.println("메서드 끝");
        }catch (Exception e){
            status = HttpStatus.BAD_REQUEST;
            message = "fail";
        }
        return ResponseEntity.status(status).body(new ResultResponseDto(message));
    }

    @DeleteMapping("/")
    public ResponseEntity<ResultResponseDto> deleteComment(@RequestBody)
}

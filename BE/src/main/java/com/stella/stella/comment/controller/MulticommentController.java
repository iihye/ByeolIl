package com.stella.stella.comment.controller;

import com.stella.stella.board.dto.ResultResponseDto;
import com.stella.stella.comment.dto.MulticommentDeleteRequestDto;
import com.stella.stella.comment.dto.MulticommentCreateRequestDto;
import com.stella.stella.comment.service.MulticommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/multicomment")
@Slf4j
public class MulticommentController {

    private final MulticommentService multicommentService;

    @PostMapping
    public ResponseEntity<ResultResponseDto> MultiCommentAdd(@RequestBody MulticommentCreateRequestDto multicommentCreateRequestDto){
        HttpStatus status = HttpStatus.OK;
        String message = "success";
        try{
            multicommentService.addMultiComment(multicommentCreateRequestDto);
        }catch (Exception e){
            status = HttpStatus.BAD_REQUEST;
            message = "fail";
        }
        return ResponseEntity.status(status).body(new ResultResponseDto(message));

    }

    @DeleteMapping("/")
    public ResponseEntity<ResultResponseDto> MultiCommentRemove(@RequestBody MulticommentDeleteRequestDto multcommentDeleteRequestDto){
        HttpStatus status = HttpStatus.OK;
        String message = "success";
        try{
            multicommentService.removeMultiComment(multcommentDeleteRequestDto);
        }catch (Exception e){
            status = HttpStatus.BAD_REQUEST;
            message = "fail";
        }
        return ResponseEntity.status(status).body(new ResultResponseDto(message));

    }

}

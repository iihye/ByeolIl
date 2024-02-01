package com.stella.stella.board.controller;

import com.stella.stella.board.dto.BoardListResponseDto;
import com.stella.stella.board.service.HashService;
import com.stella.stella.common.exception.CustomException;
import com.stella.stella.common.exception.CustomExceptionStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final HashService hashService;

    @GetMapping("")
    public ResponseEntity<Map<String, Object>> hashSearch(@RequestParam("tag") String tag, @PageableDefault(size = 5, sort = "boardInputDate", direction = Sort.Direction.ASC)Pageable pageable){
        Map<String, Object> responseBody = new HashMap<>();
        HttpStatus status = HttpStatus.OK;
        if(tag.trim().length()==0) {
            throw new CustomException(CustomExceptionStatus.INPUT_DATA_NONE);
        }
        try {
            responseBody = hashService.searchBoardList(tag, pageable);

        } catch (Exception e) {
            status = HttpStatus.BAD_REQUEST;
            responseBody.put("error", e.getMessage());
        }
        return ResponseEntity.status(status).body(responseBody);
    }
}

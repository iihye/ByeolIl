package com.stella.stella.opinion.controller;

import com.stella.stella.common.dto.BasicResponseDto;
import com.stella.stella.follow.dto.FollowRequestDto;
import com.stella.stella.opinion.dto.OpinionRequestDto;
import com.stella.stella.opinion.service.OpinionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/opinion")
public class OpinionController {
    private final OpinionService opinionService;

    // 의견 등록
    @PostMapping("/add")
    public ResponseEntity<Object> opinionAdd(@RequestBody OpinionRequestDto opinionRequestDto) {
        opinionService.addOpinion(opinionRequestDto);

        BasicResponseDto basicResponse = BasicResponseDto.builder()
                .message("success")
                .count(0)
                .build();

        return ResponseEntity.ok(basicResponse);
    }
}

package com.stella.stella.follow.controller;

import com.stella.stella.common.dto.BasicResponseDto;
import com.stella.stella.follow.dto.FollowListResponseDto;
import com.stella.stella.follow.dto.FollowRequestDto;
import com.stella.stella.follow.service.FollowService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/follow")
public class FollowController {
    private final FollowService followService;

    // 팔로우 등록
    @PostMapping("/following")
    public ResponseEntity<Object> followingAdd(@RequestBody FollowRequestDto followRequestDto) {
        followService.addFollow(followRequestDto);

        BasicResponseDto basicResponse = BasicResponseDto.builder()
                .message("success")
                .count(0)
                .build();

        return ResponseEntity.ok(basicResponse);
    }

    // 팔로우 삭제
    @DeleteMapping("/following")
    public ResponseEntity<Object> followingRemove(@RequestBody FollowRequestDto followRequestDto){
        followService.removeFollow(followRequestDto);

        BasicResponseDto basicResponse = BasicResponseDto.builder()
                .message("success")
                .count(0)
                .build();

        return ResponseEntity.ok(basicResponse);

    }

    // 팔로잉 목록 조회
    @GetMapping("/following/{memberIndex}")
    public ResponseEntity<Object> followingList(@PathVariable Long memberIndex){
        List<FollowListResponseDto> followListResponseDtos = followService.findFollowing(memberIndex);

        BasicResponseDto basicResponse = BasicResponseDto.builder()
                .message("success")
                .count(followListResponseDtos.size())
                .result(followListResponseDtos)
                .build();

        return ResponseEntity.ok(basicResponse);
    }

    // 팔로워 목록 조회
    @GetMapping("/follower/{memberIndex}")
    public ResponseEntity<Object> followerList(@PathVariable Long memberIndex){
        List<FollowListResponseDto> followListResponseDtos = followService.findFollower(memberIndex);

        BasicResponseDto basicResponse = BasicResponseDto.builder()
                .message("success")
                .count(followListResponseDtos.size())
                .result(followListResponseDtos)
                .build();

        return ResponseEntity.ok(basicResponse);
    }
}

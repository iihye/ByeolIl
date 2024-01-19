package com.stella.stella.Follow.Controller;

import com.stella.stella.Follow.Dto.FollowListResponseDto;
import com.stella.stella.Follow.Dto.FollowRequestDto;
import com.stella.stella.Follow.Service.FollowService;
import com.stella.stella.Follow.Service.FollowServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/follow")
public class FollowController {
    private final FollowService followService;

    // 팔로우 등록
    @PostMapping("/following")
    public ResponseEntity<Object> followingAdd(@RequestBody FollowRequestDto followRequestDto){
        followService.addFollow(followRequestDto);

        return ResponseEntity.ok().build();
    }

    // 팔로우 삭제
    @DeleteMapping("/following")
    public ResponseEntity<Object> followingRemove(@RequestBody FollowRequestDto followRequestDto){
        followService.removeFollow(followRequestDto);

        return ResponseEntity.ok().build();

    }

    // 팔로잉 목록 조회
    @GetMapping("/following/{memberIndex}")
    public ResponseEntity<List<FollowListResponseDto>> followingList(@PathVariable Long memberIndex){
        List<FollowListResponseDto> followListResponseDtos = followService.findFollowing(memberIndex);

        return ResponseEntity.ok().body(followListResponseDtos);
    }

    // 팔로워 목록 조회
    @GetMapping("/follower/{memberIndex}")
    public ResponseEntity<List<FollowListResponseDto>> followerList(@PathVariable Long memberIndex){
        List<FollowListResponseDto> followListResponseDtos = followService.findFollower(memberIndex);

        return ResponseEntity.ok().body(followListResponseDtos);
    }
}

package com.stella.stella.Follow.Service;

import com.stella.stella.Follow.Dto.FollowListResponseDto;
import com.stella.stella.Follow.Dto.FollowRequestDto;

import java.util.List;

public interface FollowService {
    void addFollow(FollowRequestDto followRequestDto);
    void removeFollow(FollowRequestDto followRequestDto);
    List<FollowListResponseDto> findFollowing(Long memberIndex);
    List<FollowListResponseDto> findFollower(Long memberIndex);
}

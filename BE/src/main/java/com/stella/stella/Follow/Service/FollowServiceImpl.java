package com.stella.stella.Follow.Service;

import com.stella.stella.Follow.Dto.FollowListResponseDto;
import com.stella.stella.Follow.Dto.FollowRequestDto;
import com.stella.stella.Follow.Entity.Follow;
import com.stella.stella.Follow.Repository.FollowRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class FollowServiceImpl implements FollowService {
    private final FollowRepository followRepository;
    private final MemberRepository memberRepository;

    // 팔로우 등록
    @Override
    public void addFollow(FollowRequestDto followRequestDto) {
        Member toMember = memberRepository.findByMemberIndex(followRequestDto.getToMemberIndex());
        Member fromMember = memberRepository.findByMemberIndex(followRequestDto.getFromMemberIndex());

        Follow follow = Follow.builder()
                        .toMember(toMember)
                        .fromMember(fromMember)
                        .build();

        followRepository.save(follow);
    }

    // 팔로우 삭제
    @Override
    public void removeFollow(FollowRequestDto followRequestDto) {
        Follow follow = memberRepository.findByMemberIndexs(followRequestDto.getToMemberIndex(), followRequestDto.getFromMemberIndex());

        followRepository.deleteByFollowIndex(follow.getFollowIndex());
    }

    // 팔로잉 목록 조회
    @Override
    public List<FollowListResponseDto> findFollowing(Long memberIndex){
        List<Follow> follows = followRepository.findAllByFromMemberId(memberIndex);
        List<FollowListResponseDto> followListResponseDtos = new ArrayList<>();

        for(Follow follow : follows){
            FollowListResponseDto f = FollowListResponseDto.builder()
                    .memberId(follow.getFromMember().memberId)
                    .memberName(follow.getFromMember().memberName)
                    .build();
            followListResponseDtos.add(f);
        }

        return followListResponseDtos;
    }

    // 팔로워 목록 조회
    @Override
    public List<FollowListResponseDto> findFollower(Long memberIndex){
        List<Follow> follows = followRepository.findAllByToMemberId(memberIndex);
        List<FollowListResponseDto> followListResponseDtos = new ArrayList<>();

        for(Follow follow : follows){
            FollowListResponseDto f = FollowListResponseDto.builder()
                    .memberId(follow.getFromMember().memberId)
                    .memberName(follow.getFromMember().memberName)
                    .build();
            followListResponseDtos.add(f);
        }

        return followListResponseDtos;
    }
}

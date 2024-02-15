package com.stella.stella.follow.service;

import com.stella.stella.alarm.dto.AlarmRequestDto;
import com.stella.stella.alarm.entity.Alarm;
import com.stella.stella.alarm.entity.AlarmType;
import com.stella.stella.alarm.repository.AlarmRepository;
import com.stella.stella.common.exception.CustomException;
import com.stella.stella.common.exception.CustomExceptionStatus;
import com.stella.stella.follow.dto.FollowListResponseDto;
import com.stella.stella.follow.dto.FollowRequestDto;
import com.stella.stella.follow.entity.Follow;
import com.stella.stella.follow.repository.FollowRepository;
import com.stella.stella.member.entity.Member;
import com.stella.stella.member.entity.MemberDeleteYN;
import com.stella.stella.member.repository.MemberRepository;
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
public class FollowService {
    private final FollowRepository followRepository;
    private final MemberRepository memberRepository;
    private final AlarmRepository alarmRepository;

    // 팔로우 등록
    public void addFollow(FollowRequestDto followRequestDto) {
        Member toMember = memberRepository.findByMemberIndex(followRequestDto.getToMemberIndex())
                .orElseThrow(() -> new CustomException(CustomExceptionStatus.MEMBER_INVALID));

        Member fromMember = memberRepository.findByMemberIndex(followRequestDto.getFromMemberIndex())
                .orElseThrow(() -> new CustomException(CustomExceptionStatus.MEMBER_INVALID));

        if(toMember.getMemberId() != fromMember.getMemberId()) {
            Follow follow = Follow.builder()
                    .toMember(toMember)
                    .fromMember(fromMember)
                    .build();

            followRepository.save(follow);

            Alarm alarm = Alarm.builder()
                    .toMember(toMember)
                    .fromMember(fromMember)
                    .alarmType(AlarmType.FOLLOW)
                    .build();

            alarmRepository.save(alarm);
        }
    }

    // 팔로우 삭제
    public void removeFollow(FollowRequestDto followRequestDto) {
        Follow follow = followRepository.findByMemberIndexs(followRequestDto.getToMemberIndex(), followRequestDto.getFromMemberIndex())
                        .orElseThrow(() -> new CustomException(CustomExceptionStatus.FOLLOW_INVALID));

        followRepository.deleteByFollowIndex(follow.getFollowIndex());
    }

    // 팔로잉 목록 조회
    public List<FollowListResponseDto> findFollowing(Long memberIndex){
        Member member = memberRepository.findByMemberIndex(memberIndex)
                .orElseThrow(() -> new CustomException(CustomExceptionStatus.MEMBER_INVALID));

        List<Follow> follows = followRepository.findAllByFromMemberIndex(memberIndex, MemberDeleteYN.N);
        List<FollowListResponseDto> followListResponseDtos = new ArrayList<>();

        for(Follow follow : follows){
            FollowListResponseDto f = FollowListResponseDto.builder()
                    .memberIndex(follow.getToMember().getMemberIndex())
                    .memberId(follow.getToMember().getMemberId())
                    .memberName(follow.getToMember().getMemberNickname())
                    .build();
            followListResponseDtos.add(f);
        }

        return followListResponseDtos;
    }

    // 팔로워 목록 조회
    public List<FollowListResponseDto> findFollower(Long memberIndex){
        Member member = memberRepository.findByMemberIndex(memberIndex)
                .orElseThrow(() -> new CustomException(CustomExceptionStatus.MEMBER_INVALID));

        List<Follow> follows = followRepository.findAllByToMemberIndex(memberIndex, MemberDeleteYN.N);
        List<FollowListResponseDto> followListResponseDtos = new ArrayList<>();

        for(Follow follow : follows){
            FollowListResponseDto f = FollowListResponseDto.builder()
                    .memberIndex(follow.getFromMember().getMemberIndex())
                    .memberId(follow.getFromMember().getMemberId())
                    .memberName(follow.getFromMember().getMemberNickname())
                    .build();
            followListResponseDtos.add(f);
        }

        return followListResponseDtos;
    }

}

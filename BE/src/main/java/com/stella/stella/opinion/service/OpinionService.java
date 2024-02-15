package com.stella.stella.opinion.service;

import com.stella.stella.common.exception.CustomException;
import com.stella.stella.common.exception.CustomExceptionStatus;
import com.stella.stella.member.entity.Member;
import com.stella.stella.member.repository.MemberRepository;
import com.stella.stella.opinion.dto.OpinionRequestDto;
import com.stella.stella.opinion.entity.Opinion;
import com.stella.stella.opinion.repository.OpinionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class OpinionService {
    private final OpinionRepository opinionRepository;
    private final MemberRepository memberRepository;

    public void addOpinion(OpinionRequestDto opinionRequestDto){
        Member member = memberRepository.findByMemberIndex(opinionRequestDto.getMemberIndex())
                .orElseThrow(() -> new CustomException(CustomExceptionStatus.MEMBER_INVALID));


        Opinion opinion = Opinion.builder()
                .member(member)
                .opinionText(opinionRequestDto.getOpinionText())
                .build();

        opinionRepository.save(opinion);
    }
}

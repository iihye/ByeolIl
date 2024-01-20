package com.stella.stella.member.repository;

import com.stella.stella.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long>{
    Optional<Member> findByMemberIndex(Long memberIndex);
    Optional<Member> findByMemberId(String memberId);
    Optional<Member> findByMemberIdAndMemberPlatform(String memberId,String memberPlatform);
}
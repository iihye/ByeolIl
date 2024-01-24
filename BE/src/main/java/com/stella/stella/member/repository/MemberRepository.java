package com.stella.stella.member.repository;

import com.stella.stella.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Map;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long>{
    Optional<Member> findByMemberIndex(Long memberIndex);
    Optional<Member> findByMemberIdAndMemberPlatform(String memberId,String memberPlatform);
    Optional<Member> findByMemberEmail(String email);
    Optional<Member> findByMemberNickname(String nickname);
    Optional<Member> findByMemberNameAndMemberEmailAndMemberPlatform(String memberName,String memberEmail,String memberPlatform);
    Optional<Member> findByMemberIdAndMemberNameAndMemberEmailAndMemberPlatform(String memberId, String memberName,String memberEmail,String memberPlatform);
}
package com.stella.stella.member.repository;

import com.stella.stella.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long>, MemberCustomRepository{
    Optional<Member> findByMemberIndex(Long memberIndex);
    Optional<Member> findByMemberIdAndMemberPlatform(String memberId,String memberPlatform);
    Optional<Member> findByMemberIdAndMemberPassAndMemberPlatform(String memberId,String memberPass, String memberPlatform);
    Optional<Member> findByMemberIndexAndMemberPassAndMemberPlatform(Long memberIndex,String memberPass, String memberPlatform);
    Optional<Member> findByMemberEmail(String email);
    Optional<Member> findByMemberNickname(String nickname);
    Optional<Member> findByMemberNameAndMemberEmailAndMemberPlatform(String memberName,String memberEmail,String memberPlatform);
    Optional<Member> findByMemberIdAndMemberNameAndMemberEmailAndMemberPlatform(String memberId, String memberName,String memberEmail,String memberPlatform);
    @Query("SELECT m FROM Member m WHERE m.memberIndex <> :memberIndex AND m.memberDeleteYN <> 'Y' AND m.memberRole = 'USER'")
    List<Member> findAllExcept(long memberIndex);

}
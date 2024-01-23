package com.stella.stella.follow.repository;

import com.stella.stella.follow.entity.Follow;
import com.stella.stella.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    @Query("select f from follow f where f.toMember.memberIndex =:toMemberIndex and f.fromMember.memberIndex =:fromMemberIndex")
    Optional<Follow> findByMemberIndexs(Long toMemberIndex, Long fromMemberIndex);
    void deleteByFollowIndex(Long followIndex);
//    List<Follow> findAllByFromMemberIndex(Long fromMemberIndex);
//    List<Follow> findAllByToMemberIndex(Long toMemberIndex);
}

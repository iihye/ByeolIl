package com.stella.stella.Follow.Repository;

import com.stella.stella.Follow.Entity.Follow;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    List<Follow> findAllByFromMemberId(Long fromMemberIndex);
    List<Follow> findAllByToMemberId(Long toMemberIndex);
}

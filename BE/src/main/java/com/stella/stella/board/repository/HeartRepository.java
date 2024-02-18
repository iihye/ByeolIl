package com.stella.stella.board.repository;

import com.stella.stella.board.entity.Heart;
import com.stella.stella.board.entity.Media;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface HeartRepository extends JpaRepository<Heart, Long> {
    int countByBoardBoardIndex(Long BoardIndex);

    List<Heart> findAllByMemberMemberIndex(Long MemberIndex);

    void deleteByBoardBoardIndexAndMemberMemberIndex(Long BoardIndex, Long MemberIndex);

    Optional<Heart> findByBoardBoardIndexAndMemberMemberIndex(Long BoardIndex, Long MemberIndex);

    int countByBoardBoardIndexAndMemberMemberIndex(Long BoardIndex, Long MemberIndex);

    @Modifying
    @Query(value = "select h from Heart h where h.board.boardIndex = :BoardIndex")
    Iterable<Heart> findByBoardBoardIndexList(@Param("BoardIndex")Long BoardIndex);

    @Modifying
    @Query(value = "delete from Heart h where h in :hearts")
    void deleteAllIn(@Param("hearts")Iterable<Heart> hearts);
}

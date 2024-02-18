package com.stella.stella.board.repository;

import com.stella.stella.board.entity.Heart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface HeartRepository extends JpaRepository<Heart, Long> {
    int countByBoardBoardIndex(Long boardIndex);

    List<Heart> findAllByMemberMemberIndex(Long memberIndex);

    void deleteByBoardBoardIndexAndMemberMemberIndex(Long boardIndex, Long memberIndex);

    Optional<Heart> findByBoardBoardIndexAndMemberMemberIndex(Long boardIndex, Long memberIndex);

    int countByBoardBoardIndexAndMemberMemberIndex(Long boardIndex, Long memberIndex);

    @Modifying
    @Query(value = "select h from Heart h where h.board.boardIndex = :BoardIndex")
    Iterable<Heart> findByBoardBoardIndexList(@Param("BoardIndex")Long boardIndex);

    @Modifying
    @Query(value = "delete from Heart h where h in :hearts")
    void deleteAllIn(@Param("hearts")Iterable<Heart> hearts);
}

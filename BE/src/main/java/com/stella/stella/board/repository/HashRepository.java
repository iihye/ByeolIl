package com.stella.stella.board.repository;

import com.stella.stella.board.entity.Hash;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface HashRepository extends JpaRepository<Hash, Long> {
    Optional<List<Hash>> findByBoardBoardIndex(Long BoardIndex);

    Optional<List<Hash>> findByHashContentContaining(String HashContent);

    @Modifying
    @Query("delete from Hash h where h.board.boardIndex = :boardIndex")
    void deleteAllByBoardIndex(@Param("boardIndex") Long boardIndex);
}

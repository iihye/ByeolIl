package com.stella.stella.board.repository;

import com.stella.stella.board.entity.Hash;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface HashRepository extends JpaRepository<Hash, Long> {
    Optional<List<Hash>> findByBoardBoardIndex(Long boardIndex);

    Optional<List<Hash>> findByHashContentContaining(String hashContent);

    @Modifying
    @Query("delete from Hash h where h.board.boardIndex = :boardIndex")
    void deleteAllByBoardIndex(@Param("boardIndex") Long boardIndex);

    @Modifying
    @Query(value = "select h from Hash h where h.board.boardIndex = :boardIndex")
    Iterable<Hash> findByBoardBoardIndexList(@Param("BoardIndex")Long boardIndex);

    @Modifying
    @Query(value = "delete from Hash m where m in :hashes")
    void deleteAllIn(@Param("hashes")Iterable<Hash> hashes);
}

package com.stella.stella.board.repository;

import com.stella.stella.board.entity.Media;
import com.stella.stella.radio.entity.Radio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MediaRepository extends JpaRepository<Media, Long> {
    Optional<List<Media>> findByBoardBoardIndex(Long BoardIndex);
    @Modifying
    @Query("delete from Media m where m.board.boardIndex = :boardIndex")
    void deleteAllById(@Param("boardIndex") Long boardIndex);

    @Modifying
    @Query(value = "select m from Media m where m.board.boardIndex = :BoardIndex")
    Iterable<Media> findByBoardBoardIndexList(@Param("BoardIndex")Long BoardIndex);

    @Modifying
    @Query(value = "delete from Media m where m in :medias")
    void deleteAllIn(@Param("medias")Iterable<Media> medias);
}

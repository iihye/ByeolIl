package com.stella.stella.radio.repository;

import com.stella.stella.radio.entity.Radio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RadioRepository extends JpaRepository<Radio, Long>, RadioCustomRepository {

    @Modifying
    @Query(value = "select r from Radio r where r.board.boardIndex = :BoardIndex")
    Iterable<Radio> findByBoardBoardIndexList(@Param("BoardIndex")Long BoardIndex);

    @Modifying
    @Query(value = "delete from Radio r where r in :radios")
    void deleteAllIn(@Param("radios")Iterable<Radio> radios);
}

package com.stella.stella.board.repository;

import com.stella.stella.board.entity.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BoardRepository extends JpaRepository<Board, Long> {

    int countByBoardIndex(Long BoardIndex);
    Board findByBoardIndex(Long BoardIndex);
//    Page<Board> findbyBoardLocation(Long BoardLocation, Pageable pageable);
//    Page<Board> findbyBoard(Long BoardLocation, Pageable pageable);
//    Page<Board> findbyBoardLocation(Long BoardLocation, Pageable pageable);

}

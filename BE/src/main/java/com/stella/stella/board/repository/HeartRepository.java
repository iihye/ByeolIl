package com.stella.stella.board.repository;

import com.stella.stella.board.entity.Heart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HeartRepository extends JpaRepository<Heart, Long> {
    int countByBoardBoardIndex(Long BoardIndex);
}

package com.stella.stella.board.repository;

import com.stella.stella.board.entity.Media;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MediaRepository extends JpaRepository<Media, Long> {
    Optional<List<Media>> findByBoardBoardIndex(Long BoardIndex);
}

package com.stella.stella.board.repository;

import com.stella.stella.board.entity.Hash;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HashRepository extends JpaRepository<Hash, Long> {
Optional<List<Hash>> findByBoardBoardIndex(Long BoardIndex);
Optional<List<Hash>> findByHashContentContaining(String HashContent);
}

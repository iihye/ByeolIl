package com.stella.stella.board.repository;

import com.stella.stella.board.dto.BoardListResponseDto;
import com.stella.stella.board.entity.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BoardRepository extends JpaRepository<Board, Long> {

    int countByBoardIndex(Long BoardIndex);
    Board findByBoardIndex(Long BoardIndex);

    int countByBoardLocation(Long BoardLocation);
    Page<Board> findByMemberMemberIndex(Long MemberIndex, Pageable pageable);


}

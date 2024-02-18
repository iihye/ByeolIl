package com.stella.stella.board.repository;

import com.stella.stella.board.entity.Board;
import com.stella.stella.board.entity.BoardDeleteYN;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BoardRepository extends JpaRepository<Board, Long> {

    int countByBoardIndex(Long BoardIndex);
    Optional<Board> findByBoardIndex(Long BoardIndex);

    int countByBoardLocation(Long BoardLocation);
    @Query(value = "select b from Board b where b.member.memberIndex = :memberIndex and b.boardDeleteYN =:boardDeleteYN and b.boardLocation between :locLow and :locHigh")
    List<Board> findByBoardforPage(@Param("memberIndex")Long memberIndex, @Param("boardDeleteYN")BoardDeleteYN boardDeleteYN,  @Param("locLow")Long locLow,  @Param("locHigh")Long locHigh);

    List<Board> findByMemberMemberIndexAndBoardDeleteYN(Long MemberIndex, BoardDeleteYN boardDeleteYN);

    List<Board> findByBoardIndexInAndBoardDeleteYN(List<Long> list, BoardDeleteYN boardDeleteYN);

    List<Board> findByBoardDeleteYN(BoardDeleteYN boardDeleteYN);

    List<Board> findAllByMemberMemberIndex(Long MemberIndex);
    @Query(value = "select b from Board b where b.member.memberIndex = :memberIndex and b.boardDeleteYN =:boardDeleteYN")
    List<Board> findAllByMemberIndexForDelete(@Param("memberIndex")Long memberIndex, @Param("boardDeleteYN") BoardDeleteYN boardDeleteYN);
}

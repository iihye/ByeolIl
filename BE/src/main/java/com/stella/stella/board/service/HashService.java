package com.stella.stella.board.service;

import com.stella.stella.board.dto.BoardListResponseDto;
import com.stella.stella.board.entity.Board;
import com.stella.stella.board.entity.BoardDeleteYN;
import com.stella.stella.board.entity.Hash;
import com.stella.stella.board.repository.BoardRepository;
import com.stella.stella.board.repository.HashRepository;
import com.stella.stella.common.exception.CustomException;
import com.stella.stella.common.exception.CustomExceptionStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class HashService {

    private final BoardRepository boardRepository;
    private final HashRepository hashRepository;

    @Transactional
    public List<BoardListResponseDto> searchBoardList(String hashContent) {
        List<Hash> hashes = hashRepository.findByHashContentContaining(hashContent).orElseThrow(() -> new CustomException(CustomExceptionStatus.NO_HASH_TAG));

        List<Board> boards = boardRepository
                .findByBoardIndexInAndBoardDeleteYN(hashes.stream().map(h -> h.getBoard().getBoardIndex()).toList(), BoardDeleteYN.N);


        return BoardListResponseDto.getSearchList(boards);

    }
}

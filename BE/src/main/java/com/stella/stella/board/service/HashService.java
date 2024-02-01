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
@Transactional
@RequiredArgsConstructor
public class HashService {

    private final BoardRepository boardRepository;
    private final HashRepository hashRepository;

    public Map<String, Object> searchBoardList(String hashContent, Pageable pageable){
        Map<String, Object> responseBody = new HashMap<>();
        List<BoardListResponseDto> list = new ArrayList<>();
        List<Hash> hashes= hashRepository.findByHashContentContaining(hashContent).orElseThrow(()->new CustomException(CustomExceptionStatus.NO_HASH_TAG));

        Page<Board> boards =boardRepository
                .findByBoardIndexInAndBoardDeleteYN(hashes.stream().map(h->h.getBoard().getBoardIndex()).toList(), BoardDeleteYN.N,pageable);


        responseBody.put("totalPage", boards.getTotalPages());
        //총 페이지 넘버
        responseBody.put("previousPageNumber", boards.previousOrFirstPageable().getPageNumber());
        //이전이 있으면 이전 페이지 넘버, 없으면 현재 넘버
        responseBody.put("nextPageNumber", boards.nextOrLastPageable().getPageNumber());
        //다음이 있으면 다음 페이지 넘버, 없으면 현재 넘버
        list = BoardListResponseDto.getSearchList(boards.getContent());
        responseBody.put("BoardListResponseDtoList", list);
        return responseBody;

    }
}

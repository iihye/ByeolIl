package com.stella.stella.board.service;

import com.stella.stella.board.dto.BoardCreateRequestDto;
import com.stella.stella.board.dto.BoardStarResponseDto;
import com.stella.stella.board.entity.Board;
import com.stella.stella.board.entity.Hash;
import com.stella.stella.board.entity.Media;
import com.stella.stella.board.repository.BoardRepository;
import com.stella.stella.board.repository.HashRepository;
import com.stella.stella.board.repository.HeartRepository;
import com.stella.stella.board.repository.MediaRepository;
import com.stella.stella.member.entity.Member;
import com.stella.stella.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class BoardService {


    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;
    private final MediaRepository mediaRepository;
    private final HeartRepository heartRepository;
    private final HashRepository hashRepository;
    @Transactional
    public void createBoard(BoardCreateRequestDto dto){
        Member member = memberRepository.findByMemberIndex(dto.getUserIndex()).orElseThrow(NullPointerException::new);

        Board board = Board.builder()
                .boardContent(dto.getBoardContent())
                .boardLocation(dto.getBoardLocation())
                .boardAccess(dto.getBoardAccess())
                .member(member).
                build();

        boardRepository.save(board);
    }

    @Transactional
    public BoardStarResponseDto showBoardDetail(Long boardId){
        Board board = boardRepository.findById(boardId).orElseThrow(NullPointerException::new);
        List<Media> medias = mediaRepository.findByBoardBoardIndex(boardId).orElse(Collections.emptyList());
        //미디어가 없으면 빈 리스트 반환
        List<String> mediasLocation = medias.stream()
                .map(Media::getMediaLocation)
                .toList();
        List<Hash> hashes = hashRepository.findByBoardBoardIndex(boardId).orElse(Collections.emptyList());
        List<String> Hashecontent = hashes.stream()
                .map(Hash::getHashContent)
                .toList();

        BoardStarResponseDto dto = BoardStarResponseDto.builder()
                .boardInputDate(board.getBoardInputdate())
                .boardContent(board.getBoardContent())
                .boardMedia(mediasLocation)
                .boardAccess(board.getBoardAccess())
                .boardLike(heartRepository.countByBoardBoardIndex(boardId))
                .hashContent(Hashecontent).build();

        return dto;
    }
}

package com.stella.stella.board.service;

import com.stella.stella.board.dto.BoardCreateRequestDto;
import com.stella.stella.board.dto.BoardDeleteRequestDto;
import com.stella.stella.board.dto.BoardStarResponseDto;
import com.stella.stella.board.dto.BoardUpdateRequestDto;
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
    public void createBoard(BoardCreateRequestDto dto) {
        Member member = memberRepository.findByMemberIndex(dto.getUserIndex()).orElseThrow(NullPointerException::new);
        Board board = Board.builder()
                .boardContent(dto.getBoardContent())
                .boardLocation(dto.getBoardLocation())
                .boardAccess(dto.getBoardAccess())
                .boardDeleteYN(dto.getBoardDeleteYN())
                .member(member)
                .build();


        boardRepository.save(board);
        List<String> medias = dto.getBoardMedia();
        if(medias!=null){
            for (String s : medias) {
                Media media = Media.builder()
                        .mediaLocation(s)
                        .board(board)
                        .build();

                mediaRepository.save(media);
            }
        }
        //List<String> 형태로 미디어 파일의 경로를 받아서 저장
        }
    @Transactional
    public BoardStarResponseDto showBoardDetail(Long boardId) {
        Board board = boardRepository.findById(boardId).orElseThrow(NullPointerException::new);
        //custom exception으로 바꾸기
        List<Media> medias = mediaRepository.findByBoardBoardIndex(boardId).orElse(Collections.emptyList());
        List<String> mediasLocation = medias.stream()
                .map(Media::getMediaLocation)
                .toList();

        List<Hash> hashes = hashRepository.findByBoardBoardIndex(boardId).orElse(Collections.emptyList());
        List<String> Hashecontent = hashes.stream()
                .map(Hash::getHashContent)
                .toList();

        BoardStarResponseDto dto = BoardStarResponseDto.builder()
                .boardRegtime(board.getBoardRegtime())
                .boardInputDate(board.getBoardInputdate())
                .boardContent(board.getBoardContent())
                .boardMedia(mediasLocation)
                .boardAccess(board.getBoardAccess())
                .boardLike(heartRepository.countByBoardBoardIndex(boardId))
                .hashContent(Hashecontent).build();

        return dto;
    }

    @Transactional
    public void updateBoard(BoardUpdateRequestDto dto) {
        Long boardIndex = dto.getBoardIndex();
        Board board = boardRepository.findById(boardIndex).orElseThrow(NullPointerException::new);
        //custom exception으로 바꾸기
        board.setBoardContent(dto.getBoardContent());
        board.setBoardAccess(dto.getBoardAccess());

        mediaRepository.deleteAllById(boardIndex);

        List<String> mediaLocation = dto.getBoardMedia();
        if(mediaLocation!=null) {
            for (String s : mediaLocation) {
                Media media = Media.builder()
                        .mediaLocation(s)
                        .board(board)
                        .build();
                mediaRepository.save(media);
            }
        }
    }
    @Transactional
    public void deleteBoard(BoardDeleteRequestDto boardDeleteRequestDto){
        Long boardIndex = boardDeleteRequestDto.getBoardIndex();
        int boardCount = boardRepository.countByBoardIndex(boardIndex);
        if(boardCount==1) {
            boardRepository.deleteById(boardIndex);
        }else{
            throw new RuntimeException("잘못된 요청");
            //custom exception으로 바꾸기
        }
    }
}

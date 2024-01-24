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
import com.stella.stella.common.exception.CustomException;
import com.stella.stella.common.exception.CustomExceptionStatus;
import com.stella.stella.member.entity.Member;
import com.stella.stella.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

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
        Member member = memberRepository.findByMemberIndex(dto.getMemberIndex()).orElseThrow(() -> new CustomException(CustomExceptionStatus.FIND_ID_INVALID));
        System.out.println(dto.getBoardInputDate());
        Board board = Board.builder()
                .boardInputDate(dto.getBoardInputDate())
                .boardContent(dto.getBoardContent())
                .boardLocation(dto.getBoardLocation())
                .boardAccess(dto.getBoardAccess())
                .boardDeleteYN(dto.getBoardDeleteYN())
                .member(member)
                .build();
        //dto에서 받은 memberid로 member를 찾아서 board를 만듦

        boardRepository.save(board);
        List<String> medias = dto.getBoardMedia();
        //dto에서 받은 media 경로 정보를 확인하고 media 테이블에 저장
        if (medias != null) {
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
        Board board = boardRepository.findById(boardId).orElseThrow(() -> new CustomException(CustomExceptionStatus.BOARDID_INVALID));
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
                .boardUpdateDate(board.getBoardUpdateDate())
                .boardInputDate(board.getBoardInputDate())
                .boardContent(board.getBoardContent())
                .boardMedia(mediasLocation)
                .boardAccess(board.getBoardAccess())
                .boardLike(heartRepository.countByBoardBoardIndex(boardId))
                .hashContent(Hashecontent).build();

        return dto;
    }

    @Transactional
    public void updateBoard(BoardUpdateRequestDto dto) {
        Board board = boardRepository.findById(dto.getBoardIndex()).orElseThrow(() -> new CustomException(CustomExceptionStatus.BOARDID_INVALID));
        if (board.getMember().getMemberIndex() == dto.getMemberIndex()) {

            board.setBoardContent(dto.getBoardContent());
            board.setBoardAccess(dto.getBoardAccess());
            board.setBoardInputDate(dto.getBoardInputDate());

            mediaRepository.deleteAllById(dto.getBoardIndex());

            List<String> mediaLocation = dto.getBoardMedia();
            if (mediaLocation != null) {
                for (String s : mediaLocation) {
                    Media media = Media.builder()
                            .mediaLocation(s)
                            .board(board)
                            .build();
                    mediaRepository.save(media);
                }
            }
        }else{
            throw new CustomException(CustomExceptionStatus.MEMBERID_INVALID);
        }
    }

    @Transactional
    public void deleteBoard(BoardDeleteRequestDto dto) {
        int boardCount = boardRepository.countByBoardIndex(dto.getBoardIndex());
        if (boardCount == 1) {
            if(boardRepository.findByBoardIndex(dto.getBoardIndex()).getMember().getMemberIndex()==dto.getMemberIndex()){
                boardRepository.deleteById(dto.getBoardIndex());
            }else{
                throw new CustomException(CustomExceptionStatus.MEMBER_INVALID);
            }

        } else {
            throw new CustomException(CustomExceptionStatus.BOARDID_INVALID);
        }
    }
}

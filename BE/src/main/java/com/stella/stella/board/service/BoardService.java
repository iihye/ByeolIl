package com.stella.stella.board.service;

import com.stella.stella.board.dto.*;
import com.stella.stella.board.entity.*;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class BoardService {


    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;
    private final MediaRepository mediaRepository;
    private final HeartRepository heartRepository;
    private final HashRepository hashRepository;

    @Transactional
    public void addBoard(BoardCreateRequestDto dto) {
        Member member = memberRepository.findByMemberIndex(dto.getMemberIndex()).orElseThrow(() -> new CustomException(CustomExceptionStatus.FIND_ID_INVALID));
        if (boardRepository.countByBoardLocation(dto.getBoardLocation()) != 0)
            throw new CustomException(CustomExceptionStatus.ALREADY_LOCATED);
        //location이 중복 안되게 유니크를 줘서 등록은 안되는데 entity가 만들어졌다가 등록이 안되는 거라
        //index값은 증가해버려서 방지하기 위해 넣음
        Board board = Board.builder()
                .boardInputDate(dto.getBoardInputDate())
                .boardContent(dto.getBoardContent())
                .boardLocation(dto.getBoardLocation())
                .member(member)
                .build();
        //dto에서 받은 memberid로 member를 찾아서 board를 만듦

        boardRepository.save(board);
        List<String> hashes = dto.getHashContent();
        if (hashes != null && !hashes.isEmpty()) {
            for (String s : hashes) {
                Hash hash = Hash.builder()
                        .hashContent(s)
                        .board(board)
                        .member(member).build();
                hashRepository.save(hash);
            }
        }


        List<String> medias = dto.getMediaContent();
        //dto에서 받은 media 경로 정보를 확인하고 media 테이블에 저장
        if (medias != null && !medias.isEmpty()) {
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
    public BoardStarResponseDto findBoard(Long boardIndex, Long memberIndex) {
        Board board = boardRepository.findById(boardIndex).orElseThrow(() -> new CustomException(CustomExceptionStatus.BOARDID_INVALID));
        if (board.getBoardDeleteYN() == BoardDeleteYN.Y) {
            throw new CustomException(CustomExceptionStatus.BOARD_DELETED);
        }

        Heart heart = heartRepository.findByBoardBoardIndexAndMemberMemberIndex(boardIndex,memberIndex).orElse(null);
        boolean alreadyHeartedTF = true;
        if(heart!=null) alreadyHeartedTF = false; //모든게 true로 나옴 고치기
        List<Media> medias = mediaRepository.findByBoardBoardIndex(boardIndex).orElse(Collections.emptyList());
        List<String> mediaLocations = medias.stream()
                .map(Media::getMediaLocation)
                .toList();

        List<Hash> hashes = hashRepository.findByBoardBoardIndex(boardIndex).orElse(Collections.emptyList());
        List<String> hashContent = hashes.stream()
                .map(Hash::getHashContent)
                .toList();

        BoardStarResponseDto dto = BoardStarResponseDto.builder()
                .boardRegtime(board.getBoardRegtime().format(DateTimeFormatter.ofPattern("yy.MM.dd HH:mm")))
                .boardUpdateDate(board.getBoardUpdateDate().format(DateTimeFormatter.ofPattern("yy.MM.dd HH:mm")))
                .boardInputDate(board.getBoardInputDate().format(DateTimeFormatter.ofPattern("yy.MM.dd")))
                .boardContent(board.getBoardContent())
                .boardMedia(mediaLocations)
                .alreadyHeartedTF(alreadyHeartedTF)
                .boardAccess(board.getBoardAccess())
                .boardLike(heartRepository.countByBoardBoardIndex(boardIndex))
                .hashContent(hashContent).build();

        return dto;
    }

    @Transactional
    public void modifyBoard(BoardUpdateRequestDto dto) {
        Board board = boardRepository.findById(dto.getBoardIndex()).orElseThrow(() -> new CustomException(CustomExceptionStatus.BOARDID_INVALID));
        if (board.getBoardDeleteYN() == BoardDeleteYN.Y) {
            throw new CustomException(CustomExceptionStatus.BOARD_DELETED);
        }

        if (board.getMember().getMemberIndex() == dto.getMemberIndex()) {

            board.setBoardContent(dto.getBoardContent());
            board.setBoardAccess(dto.getBoardAccess());
            board.setBoardInputDate(dto.getBoardInputDate());
            //DateTimeFormatter 이용해서 String에서 LocalDateTime으로 형변환 시켜줘야할지도

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
        } else {
            throw new CustomException(CustomExceptionStatus.MEMBERID_INVALID);
        }
    }

    @Transactional
    public void removeBoard(BoardDeleteRequestDto dto) {
        int boardCount = boardRepository.countByBoardIndex(dto.getBoardIndex());
        if (boardCount == 1) {
            if (boardRepository.findByBoardIndex(dto.getBoardIndex()).orElseThrow().getMember().getMemberIndex() == dto.getMemberIndex()) {
                Board board = boardRepository.findByBoardIndex(dto.getBoardIndex()).orElseThrow(() -> new CustomException(CustomExceptionStatus.BOARDID_INVALID));
                if (board.getBoardDeleteYN() == BoardDeleteYN.Y) {
                    throw new CustomException(CustomExceptionStatus.BOARD_DELETED);
                }

                board.setBoardDeleteYN(BoardDeleteYN.Y);
            } else {
                throw new CustomException(CustomExceptionStatus.MEMBER_INVALID);
            }

        } else {
            throw new CustomException(CustomExceptionStatus.BOARDID_INVALID);
        }
    }

    @Transactional
    public Map<String, Object> findBoardListToPage(Long memberIndex, Pageable pageable) {
        Map<String, Object> responseBody = new HashMap<>();
        Page<Board> boards = boardRepository.findByMemberMemberIndexAndBoardDeleteYN(memberIndex, BoardDeleteYN.N, pageable);

        responseBody.put("totalPage", boards.getTotalPages());
        //총 페이지 넘버
        responseBody.put("previousPageNumber", boards.previousOrFirstPageable().getPageNumber());
        //이전이 있으면 이전 페이지 넘버, 없으면 현재 넘버
        responseBody.put("nextPageNumber", boards.nextOrLastPageable().getPageNumber());
        //다음이 있으면 다음 페이지 넘버, 없으면 현재 넘버
        responseBody.put("BoardListResponseDtoList", BoardListResponseDto.wrap(memberIndex, boards.getContent()));

        return responseBody;

    }

    @Transactional
    public List<BoardListResponseDto> findBoardListToList(Long memberIndex) {
        List<Board> boards = boardRepository.findByMemberMemberIndexAndBoardDeleteYN(memberIndex, BoardDeleteYN.N);

        return BoardListResponseDto.wrap(memberIndex, boards);

    }

    @Transactional
    public List<BoardListResponseDto> findHeartedBoardList(Long memberIndex) {
        List<Heart> Hearts = heartRepository.findAllByMemberMemberIndex(memberIndex);

        if (Hearts.isEmpty()) throw new CustomException(CustomExceptionStatus.NO_HEART_CONTENT);

        List<Long> boardIndexList = new ArrayList<>();

        for (Heart H : Hearts) {
            boardIndexList.add(H.getBoard().getBoardIndex());
        }
        List<Board> boards = boardRepository.findByBoardIndexInAndBoardDeleteYN(boardIndexList, BoardDeleteYN.N);

        return BoardListResponseDto.wrap(memberIndex, boards);

    }

}

package com.stella.stella.board.service;

import com.stella.stella.board.dto.*;
import com.stella.stella.board.entity.Board;
import com.stella.stella.board.entity.Hash;
import com.stella.stella.board.entity.Heart;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;

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
        if(boardRepository.countByBoardLocation(dto.getBoardLocation())!=0) throw new CustomException(CustomExceptionStatus.ALREADY_LOCATED);
        //location이 중복 안되게 유니크를 줘서 등록은 안되는데 entity가 만들어졌다가 등록이 안되는 거라
        //index값은 증가해버려서 방지하기 위해 넣음
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
        List<String> hashes = dto.getHashContent();
        if(hashes != null && hashes.isEmpty()){
            for(String s: hashes){
                Hash hash = Hash.builder()
                        .hashContent(s)
                        .board(board)
                        .member(member).build();
            }
        }


        List<String> medias = dto.getMediaContent();
        //dto에서 받은 media 경로 정보를 확인하고 media 테이블에 저장
        if (medias!=null && medias.isEmpty()) {
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
        List<String> mediaLocations = medias.stream()
                .map(Media::getMediaLocation)
                .toList();

        List<Hash> hashes = hashRepository.findByBoardBoardIndex(boardId).orElse(Collections.emptyList());
        List<String> hashContent = hashes.stream()
                .map(Hash::getHashContent)
                .toList();

        BoardStarResponseDto dto = BoardStarResponseDto.builder()
                .boardRegtime(board.getBoardRegtime().format(DateTimeFormatter.ofPattern("yy.MM.dd HH:mm")))
                .boardUpdateDate(board.getBoardUpdateDate().format(DateTimeFormatter.ofPattern("yy.MM.dd HH:mm")))
                .boardInputDate(board.getBoardInputDate().format(DateTimeFormatter.ofPattern("yy.MM.dd")))
                .boardContent(board.getBoardContent())
                .boardMedia(mediaLocations)
                .boardAccess(board.getBoardAccess())
                .boardLike(heartRepository.countByBoardBoardIndex(boardId))
                .hashContent(hashContent).build();

        return dto;
    }

    @Transactional
    public void updateBoard(BoardUpdateRequestDto dto) {
        Board board = boardRepository.findById(dto.getBoardIndex()).orElseThrow(() -> new CustomException(CustomExceptionStatus.BOARDID_INVALID));
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
        }else{
            throw new CustomException(CustomExceptionStatus.MEMBERID_INVALID);
        }
    }

    @Transactional
    public void deleteBoard(BoardDeleteRequestDto dto) {
        int boardCount = boardRepository.countByBoardIndex(dto.getBoardIndex());
        if (boardCount == 1) {
            if(boardRepository.findByBoardIndex(dto.getBoardIndex()).orElseThrow().getMember().getMemberIndex()==dto.getMemberIndex()){
                boardRepository.deleteById(dto.getBoardIndex());
            }else{
                throw new CustomException(CustomExceptionStatus.MEMBER_INVALID);
            }

        } else {
            throw new CustomException(CustomExceptionStatus.BOARDID_INVALID);
        }
    }

    @Transactional
    public Map<String, Object> showAllBoard (Long memberIndex, Pageable pageable){
        Map<String, Object> responseBody = new HashMap<>();
        List<BoardListResponseDto> list = new ArrayList<>();
        Page<Board> boards = boardRepository.findByMemberMemberIndex(memberIndex,pageable);

        responseBody.put("totalPage", boards.getTotalPages());
        //총 페이지 넘버
        responseBody.put("previousPageNumber", boards.previousOrFirstPageable().getPageNumber());
        //이전이 있으면 이전 페이지 넘버, 없으면 현재 넘버
        responseBody.put("nextPageNumber", boards.nextOrLastPageable().getPageNumber());
        //다음이 있으면 다음 페이지 넘버, 없으면 현재 넘버
        list = BoardListResponseDto.wrap(memberIndex, boards.getContent());
        responseBody.put("BoardListResponseDtoList", list);
       return responseBody;


    }

    public Map<String, Object> showMyHeartBoard (Long memberIndex, Pageable pageable){
        Map<String, Object> responseBody = new HashMap<>();
        List<BoardListResponseDto> list = new ArrayList<>();
       List<Heart> Hearts = heartRepository.findAllByMemberMemberIndex(memberIndex).orElse(Collections.emptyList());

       if(Hearts.isEmpty()) throw new CustomException(CustomExceptionStatus.NO_HEART_CONTENT);

       List<Long> boardIndexList = new ArrayList<>();

       for(Heart H : Hearts){
           boardIndexList.add(H.getBoard().getBoardIndex());
       }
        Page<Board> boards = boardRepository.findByBoardIndexIn(boardIndexList,pageable);
        responseBody.put("totalPage", boards.getTotalPages());
        responseBody.put("previousPageNumber", boards.previousOrFirstPageable().getPageNumber());
        responseBody.put("nextPageNumber", boards.nextOrLastPageable().getPageNumber());
        list = BoardListResponseDto.wrap(memberIndex, boards.getContent());
        responseBody.put("BoardListResponseDtoList", list);

      return responseBody;

    }

}

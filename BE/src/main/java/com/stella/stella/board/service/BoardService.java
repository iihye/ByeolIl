package com.stella.stella.board.service;

import com.stella.stella.board.dto.*;
import com.stella.stella.board.entity.*;
import com.stella.stella.board.repository.BoardRepository;
import com.stella.stella.board.repository.HashRepository;
import com.stella.stella.board.repository.HeartRepository;
import com.stella.stella.board.repository.MediaRepository;
import com.stella.stella.common.S3.S3Service;
import com.stella.stella.common.exception.CustomException;
import com.stella.stella.common.exception.CustomExceptionStatus;
import com.stella.stella.member.entity.Member;
import com.stella.stella.member.repository.MemberRepository;
import com.stella.stella.radio.repository.RadioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BoardService {


    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;
    private final MediaRepository mediaRepository;
    private final HeartRepository heartRepository;
    private final HashRepository hashRepository;
    private final RadioRepository radioRepository;
    private final S3Service s3Service;

    @Transactional
    public void addBoard(BoardCreateRequestDto dto, MultipartFile[] files) throws IOException {
        Member member = memberRepository.findByMemberIndex(dto.getMemberIndex()).orElseThrow(() -> new CustomException(CustomExceptionStatus.FIND_ID_INVALID));

        BoardAccessStatus boardAccessStatus = BoardAccessStatus.OPEN;
        if(dto.getBoardAccess().equals("PARTOPEN")){
            boardAccessStatus = BoardAccessStatus.PARTOPEN;
        }else if(dto.getBoardAccess().equals("NOOPEN")){
            boardAccessStatus = BoardAccessStatus.NOOPEN;
        }

        Board board = Board.builder()
                .boardInputDate(dto.getBoardInputDate())
                .boardContent(dto.getBoardContent())
                .boardAccess(boardAccessStatus)
                .boardLocation(dto.getBoardLocation())
                .member(member)
                .build();
        //dto에서 받은 memberid로 member를 찾아서 board를 만듦

        boardRepository.save(board);
        List<String> hashes = dto.getHashContent();
        if(hashes != null && !hashes.isEmpty()){
            for(String s: hashes){
                Hash hash = Hash.builder()
                        .hashContent(s)
                        .board(board)
                        .member(member).build();
                hashRepository.save(hash);
            }
        }
        if (files != null)
            for (MultipartFile file : files) {
                String fileUrl = s3Service.saveFile(file);
                Media media = Media.builder()
                        .mediaLocation(fileUrl)
                        .board(board)
                        .build();

                mediaRepository.save(media);
            }
        //List<String> 형태로 미디어 파일의 경로를 받아서 저장
    }

    @Transactional(readOnly = true)
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

    @Transactional(readOnly = true)
    public BoardStarResponseDto findBoardReport(Long boardIndex, Long memberIndex) {
        Board board = boardRepository.findById(boardIndex).orElseThrow(() -> new CustomException(CustomExceptionStatus.BOARDID_INVALID));

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
    public void modifyBoard(BoardUpdateRequestDto dto,MultipartFile[] files) throws IOException  {
        Board board = boardRepository.findById(dto.getBoardIndex()).orElseThrow(() -> new CustomException(CustomExceptionStatus.BOARDID_INVALID));
        Member member = memberRepository.findByMemberIndex(dto.getMemberIndex()).orElseThrow(() -> new CustomException(CustomExceptionStatus.FIND_ID_INVALID));
        if (board.getBoardDeleteYN() == BoardDeleteYN.Y) {
            throw new CustomException(CustomExceptionStatus.BOARD_DELETED);
        }

        if (board.getMember().getMemberIndex() == dto.getMemberIndex()) {
            BoardAccessStatus boardAccessStatus = BoardAccessStatus.OPEN;
            if(dto.getBoardAccess().equals("PARTOPEN")){
                boardAccessStatus = BoardAccessStatus.PARTOPEN;
            }else if(dto.getBoardAccess().equals("NOOPEN")){
                boardAccessStatus = BoardAccessStatus.NOOPEN;
            }

            board.setBoardContent(dto.getBoardContent());
            board.setBoardAccess(boardAccessStatus);
            board.setBoardInputDate(dto.getBoardInputDate());
            //DateTimeFormatter 이용해서 String에서 LocalDateTime으로 형변환 시켜줘야할지도
            //기존 해쉬 모두 삭제
            hashRepository.deleteAllByBoardIndex(dto.getBoardIndex());
            //해쉬 재등록
            List<String> hashes = dto.getBoardHash();
            if(hashes != null && !hashes.isEmpty()){
                for(String s: hashes){
                    Hash hash = Hash.builder()
                            .hashContent(s)
                            .board(board)
                            .member(member).build();
                    hashRepository.save(hash);
                }
            }
            List<Media> mediaList = mediaRepository.findByBoardBoardIndex(dto.getBoardIndex()).get();
            //기존 미디어 모두 삭제
            mediaRepository.deleteAllById(dto.getBoardIndex());
            //s3에서 존재여부 비교하면서 삭제
            if(mediaList!=null) {
                List<String> mediaUrlList = mediaList.stream().map(Media::getMediaLocation).collect(Collectors.toList());
                for (String mediaUrl : dto.getBoardMedia()) {
                    mediaUrlList.remove(mediaUrl);
                }
                for(String mediaUrl: mediaUrlList)
                    s3Service.deleteFile(mediaUrl.substring(60));
            }
            //수정 이후 남아있는 미디어 다시 저장
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
            //새로 추가된 파일 저장
            if (files != null)
                for (MultipartFile file : files) {
                    String fileUrl = s3Service.saveFile(file);
                    Media media = Media.builder()
                            .mediaLocation(fileUrl)
                            .board(board)
                            .build();
                    mediaRepository.save(media);
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
                // 이미 삭제된 보드가 들어오면 에러남
                if (board.getBoardDeleteYN() == BoardDeleteYN.Y) {
                    throw new CustomException(CustomExceptionStatus.BOARD_DELETED);
                }

                board.setBoardDeleteYN(BoardDeleteYN.Y);
                board.setBoardLocation(-1L);
                //board 삭제시 라디오, 미디어 , 좋아요 삭제 로직
                radioRepository.deleteAllIn(radioRepository.findByBoardBoardIndexList(dto.getBoardIndex()));
                mediaRepository.deleteAllIn(mediaRepository.findByBoardBoardIndexList(dto.getBoardIndex()));
                heartRepository.deleteAllIn(heartRepository.findByBoardBoardIndexList(dto.getBoardIndex()));
                hashRepository.deleteAllIn(hashRepository.findByBoardBoardIndexList(dto.getBoardIndex()));
            } else {
                throw new CustomException(CustomExceptionStatus.MEMBER_INVALID);
            }

        } else {
            throw new CustomException(CustomExceptionStatus.BOARDID_INVALID);
        }
    }

    @Transactional(readOnly = true)
    public List<BoardListResponseDto> findBoardListToPage(Long memberIndex, Long page) {
        Long locLow = page*209;
        Long locHigh = (page+1)*209-1;

        List<Board> boards = boardRepository.findByBoardforPage(memberIndex, BoardDeleteYN.N,locLow,locHigh );

        return BoardListResponseDto.wrap(memberIndex,boards);

    }

    @Transactional(readOnly = true)
    public List<BoardListResponseDto> findBoardListToList(Long memberIndex) {
        List<Board> boards = boardRepository.findByMemberMemberIndexAndBoardDeleteYN(memberIndex, BoardDeleteYN.N);

        return BoardListResponseDto.wrap(memberIndex, boards);

    }

    @Transactional(readOnly = true)
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

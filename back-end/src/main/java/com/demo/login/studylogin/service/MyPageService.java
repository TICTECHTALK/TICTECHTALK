package com.demo.login.studylogin.service;

import com.demo.login.studylogin.Utils.JwtTokenUtil;
import com.demo.login.studylogin.domain.boards.BoardEntity;
import com.demo.login.studylogin.domain.members.Bookmark;
import com.demo.login.studylogin.domain.members.User;
import com.demo.login.studylogin.dto.BoardDTO;
import com.demo.login.studylogin.dto.BookmarkResponseDto;
import com.demo.login.studylogin.dto.MyPageReqDto;
import com.demo.login.studylogin.dto.MyPageResponseDto;
import com.demo.login.studylogin.exception.AppException;
import com.demo.login.studylogin.exception.ErrorCode;
import com.demo.login.studylogin.repository.BoardRepository;
import com.demo.login.studylogin.repository.BookmarkRepository;
import com.demo.login.studylogin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@Slf4j
@Service
@RequiredArgsConstructor
public class MyPageService {
    private final UserRepository userRepository;
    private final JwtTokenUtil jwtTokenUtil;
    private final BookmarkRepository bookmarkRepository;
    private final BoardRepository boardRepository;

    //마이페이지 조회
    @Transactional
    public ResponseEntity<MyPageResponseDto> getInfo() {
        User user = jwtTokenUtil.getUserFromAuthentication();
        MyPageResponseDto myPageResponseDto = MyPageResponseDto.builder()
                .userEmail(user.getUserEmail())
                .userNick(user.getUserNick())
                .userInfo(user.getUserInfo())
                .point(user.getPoint()).build();

        return ResponseEntity.ok(myPageResponseDto);
    }

    //마이페이지 수정
    @Transactional
    public ResponseEntity<?> updateInfo(MyPageReqDto myPageReqDto) {
        User user = jwtTokenUtil.getUserFromAuthentication();

        Optional<User> byUserNick = userRepository.findByUserNick(myPageReqDto.getUserNick());

        if(byUserNick.isPresent()) {
            return ResponseEntity.ok("NIKCNAME_DUPLICATED");
        }

        user.toUpdateInfo(myPageReqDto);
        userRepository.save(user);

        MyPageResponseDto responseDto = MyPageResponseDto.builder()
                .userEmail(user.getUserEmail())
                .userNick(user.getUserNick())
                .userInfo(user.getUserInfo())
                .point(user.getPoint()).build();

        return ResponseEntity.ok(responseDto);
    }

    //북마크 추가
    @Transactional
    public ResponseEntity<?> saveBookmark(Map<String, Long> postId) {
        User user = jwtTokenUtil.getUserFromAuthentication();
        Long userNo = user.getUserNo();
        Long postNo = postId.get("postId");

        BoardEntity board = new BoardEntity();
        try {
            board = (boardRepository.findById(postNo)).get();
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok("BOARD_NOT_FOUND");
        }

        Bookmark bookmark = Bookmark.builder()
                .userNo(userNo)
                .postNo(postNo).build();

        board.bookmarkSaveAndDelete(board);
        bookmarkRepository.save(bookmark);

        return ResponseEntity.ok(bookmark);
    }

    //북마크 불러오기
    @Transactional
    public ResponseEntity<List<BookmarkResponseDto>> getBookmark() {
        User user = jwtTokenUtil.getUserFromAuthentication();
        List<Bookmark> bookmarkList = bookmarkRepository.findByUserNo(user.getUserNo());

        List<BookmarkResponseDto> bookmarkReList = new ArrayList<>();

        for(Bookmark bookmark : bookmarkList) {
            Long boardNo = bookmark.getPostNo();

            BoardEntity board = new BoardEntity();
            try {
                board = (boardRepository.findById(boardNo)).get();
            } catch(Exception e) {
                log.info("존재하지 않는 게시글");
            }

            BookmarkResponseDto bookmarkResDto = BookmarkResponseDto.builder()
                    .boardNo(boardNo)
                    .title(board.getTitle()).build();

            bookmarkReList.add(bookmarkResDto);
        }

        return ResponseEntity.ok(bookmarkReList);
    }

    //북마크 해제
    @Transactional
    public ResponseEntity<String> deleteBookmark(Map<String, Long> postNo) {
        User user = jwtTokenUtil.getUserFromAuthentication();
        Long userNo = user.getUserNo();
        Long selectedPostNo = postNo.get("postNo");

        BoardEntity board = new BoardEntity();
        try {
            board = (boardRepository.findById(selectedPostNo)).get();
        } catch(Exception e) {
            return ResponseEntity.ok("BOARD_NOT_FOUND");
        }

        board.bookmarkSaveAndDelete(board);
        Bookmark bookmark = bookmarkRepository.findByUserNoAndPostNo(userNo, selectedPostNo);
        bookmarkRepository.delete(bookmark);

        return ResponseEntity.ok("북마크 해제");
    }

    //내 게시글 모두 불러오기
    @Transactional
    public ResponseEntity<List<BoardDTO>> getAllMyPosts() {
        User user = jwtTokenUtil.getUserFromAuthentication();
        List<BoardEntity> boardEntityList = user.getBoardEntityList();

        List<BoardDTO> boardDTOList = new ArrayList<>();
        for(BoardEntity board : boardEntityList) {
            BoardDTO boardDTO = BoardDTO.toBoardDTO(board);
            boardDTOList.add(boardDTO);
        }

        return ResponseEntity.ok(boardDTOList);
    }
}

package com.demo.login.studylogin.service;

import com.demo.login.studylogin.Utils.JwtTokenUtil;
import com.demo.login.studylogin.domain.boards.Board;
import com.demo.login.studylogin.domain.members.Bookmark;
import com.demo.login.studylogin.domain.members.User;
import com.demo.login.studylogin.dto.BoardDto;
import com.demo.login.studylogin.dto.MyPageReqDto;
import com.demo.login.studylogin.dto.MyPageResponseDto;
import com.demo.login.studylogin.repository.BoardRepository;
import com.demo.login.studylogin.repository.BookmarkRepository;
import com.demo.login.studylogin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        //본인의 원래 닉네임은 수정 없이 저장 가능
        if(byUserNick.isPresent() && user.getUserNo() != byUserNick.get().getUserNo()) {
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
    public ResponseEntity<?> saveBookmark(Map<String, Long> postNo) {
        User user = jwtTokenUtil.getUserFromAuthentication();
        Long userNo = user.getUserNo();
        Long postId = postNo.get("postNo");

        Board board = new Board();
        try {
            board = (boardRepository.findById(postId)).get();
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok("BOARD_NOT_FOUND");
        }

        Bookmark bookmark = Bookmark.builder()
                .userNo(userNo)
                .postNo(postId).build();


        Bookmark bookmarkTF = bookmarkRepository.findByUserNoAndPostNo(userNo, postId);
        if(bookmarkTF == null) {
            board.bookmarkSaveAndDelete(board);
            bookmarkRepository.save(bookmark);
        }else {
            board.bookmarkSaveAndDelete(board);
            bookmarkRepository.deleteByPostNoAndUserNo(postId, userNo);
        }

        return ResponseEntity.ok(bookmark);
    }

    //북마크 불러오기
    @Transactional
    public ResponseEntity<List<BoardDto>> getBookmark() {
        User user = jwtTokenUtil.getUserFromAuthentication();
        List<Bookmark> bookmarkList = bookmarkRepository.findByUserNo(user.getUserNo());

        List<BoardDto> bookmarkReList = new ArrayList<>();

        for(Bookmark bookmark : bookmarkList) {
            Long postNum = bookmark.getPostNo();

            Board board = new Board();
            try {
                board = (boardRepository.findById(postNum)).get();
            } catch(Exception e) {
                log.info("존재하지 않는 게시글");
            }

            BoardDto boardDto = BoardDto.builder()
                    .postNo(postNum)
                    .postDate(board.getPostDate())
                    .userNick(board.getUserEntity().getUserNick())
                    .views(board.getViews())
                    .title(board.getTitle()).build();

            bookmarkReList.add(boardDto);
        }

        return ResponseEntity.ok(bookmarkReList);
    }

    //내 게시글 모두 불러오기
    @Transactional
    public ResponseEntity<List<BoardDto>> getAllMyPosts() {
        User user = jwtTokenUtil.getUserFromAuthentication();
        List<Board> boardList = user.getBoardList();

        List<BoardDto> boardDTOList = new ArrayList<>();
        for(Board board : boardList) {
            BoardDto boardDTO = BoardDto.toBoardDTO(board);
            boardDTOList.add(boardDTO);
        }

        return ResponseEntity.ok(boardDTOList);
    }
}

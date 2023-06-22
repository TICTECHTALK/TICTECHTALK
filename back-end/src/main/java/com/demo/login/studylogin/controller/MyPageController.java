package com.demo.login.studylogin.controller;

import com.demo.login.studylogin.Utils.JwtTokenUtil;
import com.demo.login.studylogin.domain.members.Bookmark;
import com.demo.login.studylogin.domain.members.User;
import com.demo.login.studylogin.dto.BoardDTO;
import com.demo.login.studylogin.dto.BookmarkResponseDto;
import com.demo.login.studylogin.dto.MyPageReqDto;
import com.demo.login.studylogin.dto.MyPageResponseDto;
import com.demo.login.studylogin.service.MyPageService;
import com.demo.login.studylogin.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/mypage")
@RequiredArgsConstructor
public class MyPageController {

    private final MyPageService myPageService;

    //마이페이지 조회
    @GetMapping(value = "/info")
    public ResponseEntity<MyPageResponseDto> getInfo() {
        return myPageService.getInfo();
    }

    //마이페이지 수정
    @PostMapping(value = "/update")
    public ResponseEntity<?> updateInfo(@RequestBody MyPageReqDto myPageReqDto) {
        return myPageService.updateInfo(myPageReqDto);
    }

    //북마크 추가
    @PostMapping(value = "/bookmark/save")
    public ResponseEntity<?> saveBookmark(@RequestBody Map<String, Long> postId) {
        return myPageService.saveBookmark(postId);
    }

    //북마크 불러오기
    @GetMapping(value = "/bookmark/get")
    public ResponseEntity<List<BookmarkResponseDto>> getBookmark() {
        return myPageService.getBookmark();
    }

    //북마크 삭제
    @PostMapping(value = "/bookmark/delete")
    public ResponseEntity<String> deleteBookmark(@RequestBody Map<String, Long> postNo) {
        return myPageService.deleteBookmark(postNo);
    }

    //내 게시글 전체 불러오기
    @GetMapping(value = "/mypost")
    public ResponseEntity<List<BoardDTO>> getAllMyPosts() {
        return myPageService.getAllMyPosts();
    }

}

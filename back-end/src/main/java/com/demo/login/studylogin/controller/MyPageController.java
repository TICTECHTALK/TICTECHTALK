package com.demo.login.studylogin.controller;

import com.demo.login.studylogin.dto.BoardDto;
import com.demo.login.studylogin.dto.BookmarkResponseDto;
import com.demo.login.studylogin.dto.MyPageReqDto;
import com.demo.login.studylogin.dto.MyPageResponseDto;
import com.demo.login.studylogin.service.MyPageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    //북마크 추가 -> 좋아요와 같은 로직인 부분
    @PostMapping(value = "/bookmark/save")
    public ResponseEntity<?> saveBookmark(@RequestBody Map<String, Long> postNo) {
        return myPageService.saveBookmark(postNo);
    }

    //북마크 불러오기
    @GetMapping(value = "/bookmark/get")
    public ResponseEntity<List<BookmarkResponseDto>> getBookmark() {
        return myPageService.getBookmark();
    }

    //북마크 삭제 (앞단 기능 구현 확인되면 삭제 예정)
//    @PostMapping(value = "/bookmark/delete")
//    public ResponseEntity<String> deleteBookmark(@RequestBody Map<String, Long> postNo) {
//        return myPageService.deleteBookmark(postNo);
//    }

    //내 게시글 전체 불러오기
    @GetMapping(value = "/mypost")
    public ResponseEntity<List<BoardDto>> getAllMyPosts() {
        return myPageService.getAllMyPosts();
    }

}

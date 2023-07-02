package com.demo.login.studylogin.controller;

import com.demo.login.studylogin.dto.UserJoinRequest;
import com.demo.login.studylogin.dto.UserLoginRequest;
import com.demo.login.studylogin.service.AuthService;
import com.demo.login.studylogin.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping(value = "/users")
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    //회원가입
    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody UserJoinRequest dto) {
        return userService.join(dto);
    }

    //로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid UserLoginRequest dto, HttpServletResponse response) {
        log.info("진입");
        return userService.login(dto, response);
    }

    //로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        return userService.logout(request);
    }

    //회원탈퇴
    @PostMapping("/delete")
    public ResponseEntity<?> delete(HttpServletRequest request) {
        return userService.delete(request);
    }



    //액세스 토큰 재발급
    @PostMapping("/reissue")
    public ResponseEntity<?> reissue(
            HttpServletRequest request, HttpServletResponse response)  {
        return authService.reissue(request, response);

    }

}

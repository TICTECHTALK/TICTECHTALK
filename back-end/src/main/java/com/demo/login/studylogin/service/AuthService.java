package com.demo.login.studylogin.service;

import com.demo.login.studylogin.domain.members.User;
import org.springframework.http.ResponseEntity;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface AuthService {
    User getAuth(HttpServletRequest request);

    ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response);
}

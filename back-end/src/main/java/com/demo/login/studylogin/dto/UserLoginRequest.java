package com.demo.login.studylogin.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserLoginRequest {
    private String userEmail;
    private String password;

    public UserLoginRequest() {}
}

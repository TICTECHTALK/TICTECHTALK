package com.demo.login.studylogin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenDto {
    // 권한부여 유형
    private String grantType;
    private String accessToken;
    private String refreshToken;
    // 엑세스 토큰의 만료 시간
    private Long accessTokenExpiresIn;
}
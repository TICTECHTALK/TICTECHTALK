package com.demo.login.studylogin.dto;

import lombok.*;


@Builder
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class MyPageResponseDto {
    private String userEmail;
    private String userNick;
    private String userInfo;
    private Long point;
}

package com.demo.login.studylogin.dto;

import lombok.*;


@Builder
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class MyPageReqDto {
    private String userNick;
    private String userInfo;
}

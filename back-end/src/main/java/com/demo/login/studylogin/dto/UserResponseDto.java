package com.demo.login.studylogin.dto;

import lombok.*;


@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
    private Long userNo;
    private String userEmail;
    private String userNick;

}

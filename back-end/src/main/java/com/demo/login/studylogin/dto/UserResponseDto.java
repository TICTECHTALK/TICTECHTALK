package com.demo.login.studylogin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
    private Long userNo;
    private String userEmail;
    private String userNick;
//    private LocalDateTime createdAt;
//    private LocalDateTime modifiedAt;
}

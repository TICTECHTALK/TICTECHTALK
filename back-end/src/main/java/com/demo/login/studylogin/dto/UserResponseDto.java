package com.demo.login.studylogin.dto;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
    private Long userNo;
    private String userEmail;
    private String userNick;
//    private LocalDateTime createdAt;
//    private LocalDateTime modifiedAt;
}

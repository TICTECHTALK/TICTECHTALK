package com.demo.login.studylogin.dto;

import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookmarkResponseDto {

    private Long boardNo;
    private String title;
}

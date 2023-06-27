package com.demo.login.studylogin.dto;

import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatResDto {

    private Long id;
    private String receiver;
    private List<String> chatUser;
    private List<Map<String, String>> chatData;
}

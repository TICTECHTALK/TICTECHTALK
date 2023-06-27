package com.demo.login.studylogin.dto;

import com.demo.login.studylogin.domain.members.User;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ChatMessageDto {
    private String roomId; // 방번호
    private User sender; // 메시지 보낸사람
    private String authorization; // 보낸사람의 토큰 정보
    private String message; // 메시지
    private LocalDateTime sentAt; // 발송 시간
}
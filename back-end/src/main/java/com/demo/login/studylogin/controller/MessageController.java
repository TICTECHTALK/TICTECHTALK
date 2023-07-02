package com.demo.login.studylogin.controller;


import com.demo.login.studylogin.dto.ChatReqDto;
import com.demo.login.studylogin.service.ChatService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;


//publisher 구현
//subscriber는 서버단에서 구현할 것이 없고, 앞단에서 stomp 라이브러리를 이용하여 subscriber 주소를 바라보고 있는 주소를 작성하면 됨
@Controller
@Slf4j
@RequiredArgsConstructor
public class MessageController {

    private final SimpMessageSendingOperations messagingTemplate;
    private final ChatService chatService;

    @MessageMapping("/chat/message")
    public void message(@Payload ChatReqDto dto, Message<?> message) throws JsonProcessingException {
        chatService.sendJsonData(dto, message);
        messagingTemplate.convertAndSend("/sub/" + dto.getRoomId(), dto);
    }

}



package com.demo.login.studylogin.controller;

import com.demo.login.studylogin.dto.ChatReqDto;
import com.demo.login.studylogin.dto.ChatResDto;
import com.demo.login.studylogin.dto.ChatRoomDto;
import com.demo.login.studylogin.service.ChatService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/chat")
@Slf4j
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    //채팅방 생성
    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody ChatRoomDto dto) throws JsonProcessingException {
        return chatService.createChatRoom(dto);
    }

    // 채팅방의 모든 메세지 내역 반환
    @PostMapping("/get")
    public ResponseEntity<ChatResDto> getJsonData(@RequestBody Map<String, String> roomId) throws JsonProcessingException {
        log.info("get진입");
        return chatService.getJsonData(roomId);
    }

    //현재 존재하는 모든 유저의 리스트 반환
    @GetMapping("/user-list")
    public ResponseEntity<?> getUsers() {
        return chatService.getUsers();
    }


    @PostMapping("/send")
    public ResponseEntity<?> sendJsonData(@RequestBody ChatReqDto dto) throws JsonProcessingException {
        log.info("보내기 진입 확인");
        return chatService.sendJsonData(dto);
    }


}

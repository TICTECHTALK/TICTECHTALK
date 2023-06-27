package com.demo.login.studylogin.service;

import com.demo.login.studylogin.Utils.JwtTokenUtil;
import com.demo.login.studylogin.domain.chat.Chat;
import com.demo.login.studylogin.domain.chat.ChatRoom;
import com.demo.login.studylogin.domain.members.User;
import com.demo.login.studylogin.dto.ChatReqDto;
import com.demo.login.studylogin.dto.ChatResDto;
import com.demo.login.studylogin.dto.ChatRoomDto;
import com.demo.login.studylogin.dto.UserResponseDto;
import com.demo.login.studylogin.repository.ChatRepository;
import com.demo.login.studylogin.repository.ChatRoomRepository;
import com.demo.login.studylogin.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final JwtTokenUtil jwtTokenUtil;

    private static final String BEARER_PREFIX = "Bearer ";

    ObjectMapper objectMapper = new ObjectMapper();


    @Transactional
    public ResponseEntity<?> createChatRoom(ChatRoomDto dto) throws JsonProcessingException {

        List<String> chatUsers = dto.getChatUser();

        String user1 = chatUsers.get(0);
        String user2 = chatUsers.get(1);

        //chatUser 중복 확인
        List<ChatRoom> existingChatRooms = chatRoomRepository.findAll();
        for (ChatRoom chatRoom : existingChatRooms) {
            List<String> existingUsers = objectMapper.readValue(chatRoom.getChatUser(), new TypeReference<List<String>>() {});
            if (existingUsers.contains(user1) && existingUsers.contains(user2)) {
                // 요청된 userNo 조합이 이미 존재한다면 해당 방의 roomId를 반환
                return ResponseEntity.ok(chatRoom.getRoomId());
            }
        }

        String roomId = UUID.randomUUID().toString();
        String chatUserStr = objectMapper.writeValueAsString(dto.getChatUser());

        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setRoomId(roomId);
        chatRoom.setChatUser(chatUserStr);

        chatRoomRepository.save(chatRoom);
        return ResponseEntity.ok(roomId);
    }


    //채팅 내역 json으로 변환 후 저장
    public ResponseEntity<?> sendJsonData(ChatReqDto dto, Message<?> message) throws JsonProcessingException {
//        ObjectMapper objectMapper = new ObjectMapper();
        String roomId = dto.getRoomId();
        log.info("어떠냐 " + roomId);
        Chat chat = new Chat();

        try {
            if(chatRepository.findByRoomId(roomId) != null) {
                Chat oldChat = chatRepository.findByRoomId(roomId);
                List<Map<String, String>> dataData = objectMapper.readValue(oldChat.getChatData(), new TypeReference<List<Map<String, String>>>() {});
                Map<String, String> reqData = dto.getChatData();

                List<Map<String, String>> list = new ArrayList<>();
                for(Map<String, String> oldChatMsg : dataData) {
                    list.add(oldChatMsg);
                }
                list.add(reqData);

                log.info("진입3");
                String useSetData = objectMapper.writeValueAsString(list);

                oldChat.setChatData(useSetData);
                chatRepository.save(oldChat);
                log.info("진입4");
                chat = oldChat;
                log.info("진입5");

            } else {
                Map<String, String> reqData = dto.getChatData();
                List<Map<String, String>> mapList = new ArrayList<>();
                mapList.add(reqData);

                String json1 = objectMapper.writeValueAsString(dto.getChatUser());
                String json2 = objectMapper.writeValueAsString(mapList);

                chat.setChatUser(json1);
                chat.setChatData(json2);
                chat.setRoomId(roomId);

                chatRepository.save(chat);
            }
        } catch(JsonProcessingException e) {
            e.printStackTrace();
        }

        Long userNo = jwtTokenUtil.getUserNoFromStompToken(message);
//        Long userNo = jwtTokenUtil.getUserFromAuthentication().getUserNo();
        log.info("ChatService :: userNo" + userNo);
        List<String> users = objectMapper.readValue(chat.getChatUser(), new TypeReference<List<String>>() { });
        log.info("ChatService :: users" + users);
        List<Map<String, String>> dataData = objectMapper.readValue(chat.getChatData(), new TypeReference<List<Map<String, String>>>() {});
        log.info("ChatService :: dataData" + dataData);

        Long receiverNo = Long.valueOf((userNo.toString().equals(users.get(0))) ? users.get(1) : users.get(0));
        String receiverNick = (userRepository.findById(receiverNo)).get().getUserNick();

        ChatResDto chatResDto = ChatResDto.builder()
                .id(chat.getChatNo())
                .receiver(receiverNick)
                .chatUser(users)
                .chatData(dataData)
                .build();
        log.info("ChatService :: chatResDto" + chatResDto);

        return ResponseEntity.ok(chatResDto);
    }

    @Transactional
    public ResponseEntity<ChatResDto> getJsonData(Map<String, String> roomId)  throws JsonProcessingException {
        log.info("roomId" + roomId);

        ChatResDto chatResDto = new ChatResDto();
        Chat chat = chatRepository.findByRoomId(roomId.get("roomId"));

//        ObjectMapper objectMapper = new ObjectMapper();
        try {
            if(chat != null) {
                log.info("1");
                List<String> users = objectMapper.readValue(chat.getChatUser(), new TypeReference<List<String>>() { });
                log.info("1-1");
                List<Map<String, String>> dataData = objectMapper.readValue(chat.getChatData(), new TypeReference<List<Map<String, String>>>() {});
                log.info("1-2");

                log.info("2");
                Long userNo = jwtTokenUtil.getUserFromAuthentication().getUserNo();
                Long receiverNo = Long.valueOf((userNo.toString().equals(users.get(0))) ? users.get(1) : users.get(0));
                String receiverNick = (userRepository.findById(receiverNo)).get().getUserNick();

                log.info("3");
                chatResDto = ChatResDto.builder()
                        .id(chat.getChatNo())
                        .receiver(receiverNick)
                        .chatUser(users)
                        .chatData(dataData)
                        .build();
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok(chatResDto);
    }


    //모든 사용자 목록 반환 로직
    public ResponseEntity<?> getUsers() {
        List<User> userList = userRepository.findAllBy();
        List<UserResponseDto> userResponseList = new ArrayList<>();
        for (User user : userList) {
            UserResponseDto userResponseDto = new UserResponseDto();
            userResponseDto.setUserNo(user.getUserNo());
            userResponseDto.setUserNick(user.getUserNick());
            userResponseList.add(userResponseDto);
        }
        return ResponseEntity.ok(userResponseList);
    }





    /*
    * 추가해야 하는 기능 :
    * 1. roomId를 Chat에 추가하면 -> 내가 속한 모든 채팅방 목록을 반환 가능
    * 1.1 ChatRoom table에 roomName은 삭제, 채팅을 거는 순간 roomId가 생성이 되고 chatUsers에 채팅을 건 사람과 받은 사람의 userNo가 저장되는 방법
    *   -> chatroom 엔티티 유지
    * 2. chatUsers에 내 userNo가 존재하는 모든 roomId의 목록을 반환(receiver까지) -> 채팅방 목록 기능
    * */



//
//    public <T> void sendMessage(WebSocketSession session, T message) {
//        try {
//            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(message)));
//        } catch (IOException e) {
//            log.error(e.getMessage(), e);
//        }
//    }
}


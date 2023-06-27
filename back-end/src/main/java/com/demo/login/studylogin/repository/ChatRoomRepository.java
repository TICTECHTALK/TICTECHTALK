package com.demo.login.studylogin.repository;


import com.demo.login.studylogin.domain.chat.Chat;
import com.demo.login.studylogin.domain.chat.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, String> {

    ChatRoom findByRoomId(String roomId);

    Chat findByChatUser(String chatUser);
}

package com.demo.login.studylogin.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
public class ChatRoomDto {

    private String roomId;
    private List<String> chatUser;

}


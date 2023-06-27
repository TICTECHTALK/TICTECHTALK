package com.demo.login.studylogin.domain.chat;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;


@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "CHATROOMTABLE")
public class ChatRoom {

    @Id
    private String roomId;

    @Column(columnDefinition = "json")
    private String chatUser;


}

package com.demo.login.studylogin.domain.chat;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "CHATTABLE")
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chatNo;

    @Column(columnDefinition = "json")
    private String chatUser;

    @Column(columnDefinition = "json")
    private String chatData;

    @Column
    private String roomId;

}

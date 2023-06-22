package com.demo.login.studylogin.domain.boards;


import com.demo.login.studylogin.domain.members.User;
import com.demo.login.studylogin.dto.ReCmDTO;
import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import javax.persistence.*;
import java.time.LocalDateTime;

@Slf4j
@Getter
@Setter
@Entity
@Table(name="RECMTABLE")
public class ReCmEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    private Long recmId;

    @Column(nullable = false)
    private String recmContent;

    @Column
    private LocalDateTime recmDate;

    @PrePersist
    private void perPersist() {
        recmDate = LocalDateTime.now();
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="cm_id")
//    @JsonBackReference
    private CommentEntity commentEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="userno")
//    @JsonBackReference
    private User userEntity;


    public static ReCmEntity toSaveEntity(ReCmDTO recmDTO, CommentEntity commentEntity, User userEntity){
        ReCmEntity recmEntity = new ReCmEntity();

        recmEntity.setRecmContent(recmDTO.getRecmContent());
        recmEntity.setCommentEntity(commentEntity);
        recmEntity.setUserEntity(userEntity);

        return recmEntity;
    }
}

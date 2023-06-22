package com.demo.login.studylogin.domain.boards;


import com.demo.login.studylogin.domain.members.User;
import com.demo.login.studylogin.dto.ReCmDto;
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
public class ReCm {

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
    private Comment comment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="userno")
//    @JsonBackReference
    private User userEntity;


    public static ReCm toSaveEntity(ReCmDto recmDTO, Comment comment, User userEntity){
        ReCm recm = new ReCm();

        recm.setRecmContent(recmDTO.getRecmContent());
        recm.setComment(comment);
        recm.setUserEntity(userEntity);

        return recm;
    }
}

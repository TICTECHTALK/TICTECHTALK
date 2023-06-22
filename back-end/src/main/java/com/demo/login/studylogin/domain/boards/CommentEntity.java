package com.demo.login.studylogin.domain.boards;

import com.demo.login.studylogin.domain.members.User;
import com.demo.login.studylogin.dto.CommentDTO;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;
import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name="COMMENTTABLE")
public class CommentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cmId;

    @Column(nullable=false)
    private String cmContent;

    @Column
    private LocalDateTime cmDate;

//    @Column
//    private boolean likey;
    //////////////////////////////////////////////
    @Builder.Default
    @ColumnDefault("0")
    private int likeTF = 0;

    @Builder.Default
    @ColumnDefault("0")
    private Long totlaLikeNum = 0L;
    //////////////////////////////////////////////

    @PrePersist
    private void perPersist() {
        cmDate = LocalDateTime.now();
    }

    // board : comment = 1 : N (1 개의 게시글에 여러 댓글 달 수 있다)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="post_no")
//    @JsonBackReference
    private BoardEntity boardEntity;

    // user : comment = 1 : N (한 회원은 게시글에 여러 댓글을 달 수 있다)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="userNo")
//    @JsonBackReference
    private User userEntity;

    public static CommentEntity toSaveEntity(CommentDTO commentDTO, BoardEntity boardEntity, User userEntity) {
        CommentEntity commentEntity = new CommentEntity();

        commentEntity.setCmContent(commentDTO.getCmContent());
        commentEntity.setBoardEntity(boardEntity);
        commentEntity.setUserEntity(userEntity);

        return commentEntity;
    }

    public void likeSaveAndDelete(CommentEntity commentEntity) {
        if(commentEntity.getLikeTF() == 0) {
            this.likeTF = 1;
        } else {
            this.likeTF = 0;
        }
    }

    public void totalLikeNumPlus() {
        this.totlaLikeNum = this.getTotlaLikeNum() + 1;
    }

    public void totalLikeNumMinus() {
        this.totlaLikeNum = this.getTotlaLikeNum() - 1;
    }

}

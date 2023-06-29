package com.demo.login.studylogin.domain.boards;

import com.demo.login.studylogin.domain.members.User;
import com.demo.login.studylogin.dto.CommentDto;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Builder
@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name="COMMENTTABLE")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cmId;

    @Column(nullable=false)
    private String cmContent;

    @Column
    private LocalDateTime cmDate;

    //////////////////////////////////////////////

    @Builder.Default
    @ColumnDefault("0")
    private Long totalLikeNum = 0L;
    //////////////////////////////////////////////

    @PrePersist
    private void perPersist() {
        cmDate = LocalDateTime.now();
    }

    // board : comment = 1 : N (1 개의 게시글에 여러 댓글 달 수 있다)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="post_no")
//    @JsonBackReference
    private Board board;

    // user : comment = 1 : N (한 회원은 게시글에 여러 댓글을 달 수 있다)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="userNo")
//    @JsonBackReference
    private User userEntity;

    @OneToMany(mappedBy="comment", cascade = CascadeType.REMOVE, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ReCm> recmList = new ArrayList<>();

    public static Comment toSaveEntity(CommentDto commentDTO, Board board, User userEntity) {
        Comment comment = new Comment();

        comment.setCmContent(commentDTO.getCmContent());
        comment.setBoard(board);
        comment.setUserEntity(userEntity);

        return comment;
    }

    public void totalLikeNumPlus() {
        this.totalLikeNum = this.getTotalLikeNum() + 1;
    }

    public void totalLikeNumMinus() {
        this.totalLikeNum = this.getTotalLikeNum() - 1;
    }

}

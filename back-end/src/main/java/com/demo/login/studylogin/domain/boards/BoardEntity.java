package com.demo.login.studylogin.domain.boards;

import com.demo.login.studylogin.domain.members.User;
import com.demo.login.studylogin.dto.BoardDTO;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;
import net.bytebuddy.asm.Advice;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Builder
@Getter
@Setter
@Entity
@Table(name = "BOARDTABLE")
@AllArgsConstructor
@NoArgsConstructor
public class BoardEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long postNo;

    @Column(nullable = false)
    private Long category;

    @Column(length=50, nullable = false)
    private String title;

    @Column(length=500, nullable = false)
    private String content;

    @Column
    private LocalDateTime postDate;

    @Column
    private int views;

    @Column(length=100)
    private String link;

    @Column
    private String originFileName;

    @Column
    private String storedFileName;

    //추가된 북마크 관련 코드
    @Builder.Default
    @ColumnDefault("0")
    private int bookmarkTF = 0;

    @PrePersist
    public void prePersist() {
        postDate = LocalDateTime.now();
    }

    //댓글과 참조 관계
    @OneToMany(mappedBy="boardEntity", cascade = CascadeType.REMOVE, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<CommentEntity> commentEntityList = new ArrayList<>();

    //회원과 참조 관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userNo")
    private User userEntity;


    //파일 없을 때 save
    public static BoardEntity toSaveEntity(BoardDTO boardDTO, User userEntity) {
        BoardEntity boardEntity = new BoardEntity();

        boardEntity.setTitle(boardDTO.getTitle());
        boardEntity.setContent(boardDTO.getContent());
        boardEntity.setCategory(boardDTO.getCategory());
        boardEntity.setViews(0);
        boardEntity.setPostDate(boardDTO.getPostDate());
        boardEntity.setLink(boardDTO.getLink());
        boardEntity.setUserEntity(userEntity);

        return boardEntity;
    }

    //파일 있을 때 save
    public static BoardEntity toSaveFileEntity(BoardDTO boardDTO, String storedFilename, User userEntity) {
        BoardEntity boardEntity = new BoardEntity();

        boardEntity.setTitle(boardDTO.getTitle());
        boardEntity.setContent(boardDTO.getContent());
        boardEntity.setCategory(boardDTO.getCategory());
        boardEntity.setViews(0);
        boardEntity.setPostDate(boardDTO.getPostDate());
        boardEntity.setLink(boardDTO.getLink());
        boardEntity.setUserEntity(userEntity);

        boardEntity.setOriginFileName(boardDTO.getBoardFile().getOriginalFilename());
        boardEntity.setStoredFileName(storedFilename);

        return boardEntity;
    }


    //파일 없을 때 update
    public static BoardEntity toUpdateEntity(BoardDTO boardDTO, User userEntity) {
        BoardEntity boardEntity = new BoardEntity();

        boardEntity.setPostNo(boardDTO.getPostNo()); // id가 있어야만 update 쿼리 전달함
        boardEntity.setTitle(boardDTO.getTitle());
        boardEntity.setContent(boardDTO.getContent());
        boardEntity.setCategory(boardDTO.getCategory());
        boardEntity.setViews(boardDTO.getViews());
        boardEntity.setPostDate(LocalDateTime.now());
        boardEntity.setLink(boardDTO.getLink());
        boardEntity.setUserEntity(userEntity);

        return boardEntity;
    }

    //파일 있을 때 update
    public static BoardEntity toUpdateFileEntity (BoardDTO boardDTO, User userEntity) {
        BoardEntity boardEntity = new BoardEntity();

        boardEntity.setPostNo(boardDTO.getPostNo()); // id가 있어야만 update 쿼리 전달함
        boardEntity.setTitle(boardDTO.getTitle());
        boardEntity.setContent(boardDTO.getContent());
        boardEntity.setCategory(boardDTO.getCategory());
        boardEntity.setViews(boardDTO.getViews());
        boardEntity.setPostDate(LocalDateTime.now());
        boardEntity.setLink(boardDTO.getLink());
        boardEntity.setUserEntity(userEntity);

        boardEntity.setOriginFileName(boardDTO.getOriginalFileName());
        boardEntity.setStoredFileName(boardDTO.getStoredFileName());

        return boardEntity;
    }

    public void bookmarkSaveAndDelete(BoardEntity board) {
        if(board.getBookmarkTF() == 0) {
            this.bookmarkTF = 1;
        } else {
            this.bookmarkTF = 0;
        }
    }
}

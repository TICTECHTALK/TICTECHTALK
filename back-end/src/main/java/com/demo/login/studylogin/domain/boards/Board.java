package com.demo.login.studylogin.domain.boards;

import com.demo.login.studylogin.domain.members.User;
import com.demo.login.studylogin.dto.BoardDto;
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
@Table(name = "BOARDTABLE")
@AllArgsConstructor
@NoArgsConstructor
public class Board {

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
    @OneToMany(mappedBy="board", cascade = CascadeType.REMOVE, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Comment> commentList = new ArrayList<>();

    //회원과 참조 관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userNo")
    private User userEntity;


    //파일 없을 때 save
    public static Board toSaveEntity(BoardDto boardDTO, User userEntity) {
        Board board = new Board();

        board.setTitle(boardDTO.getTitle());
        board.setContent(boardDTO.getContent());
        board.setCategory(boardDTO.getCategory());
        board.setViews(0);
        board.setPostDate(boardDTO.getPostDate());
        board.setLink(boardDTO.getLink());
        board.setUserEntity(userEntity);

        return board;
    }

    //파일 있을 때 save
    public static Board toSaveFileEntity(BoardDto boardDTO, String storedFilename, User userEntity) {
        Board board = new Board();

        board.setTitle(boardDTO.getTitle());
        board.setContent(boardDTO.getContent());
        board.setCategory(boardDTO.getCategory());
        board.setViews(0);
        board.setPostDate(boardDTO.getPostDate());
        board.setLink(boardDTO.getLink());
        board.setUserEntity(userEntity);

        board.setOriginFileName(boardDTO.getBoardFile().getOriginalFilename());
        board.setStoredFileName(storedFilename);

        return board;
    }


    //파일 없을 때 update
    public static Board toUpdateEntity(BoardDto boardDTO, User userEntity) {
        Board board = new Board();

        board.setPostNo(boardDTO.getPostNo()); // id가 있어야만 update 쿼리 전달함
        board.setTitle(boardDTO.getTitle());
        board.setContent(boardDTO.getContent());
        board.setCategory(boardDTO.getCategory());
        board.setViews(boardDTO.getViews());
        board.setPostDate(LocalDateTime.now());
        board.setLink(boardDTO.getLink());
        board.setUserEntity(userEntity);

        return board;
    }

    //파일 있을 때 update
    public static Board toUpdateFileEntity (BoardDto boardDTO, User userEntity) {
        Board board = new Board();

        board.setPostNo(boardDTO.getPostNo()); // id가 있어야만 update 쿼리 전달함
        board.setTitle(boardDTO.getTitle());
        board.setContent(boardDTO.getContent());
        board.setCategory(boardDTO.getCategory());
        board.setViews(boardDTO.getViews());
        board.setPostDate(LocalDateTime.now());
        board.setLink(boardDTO.getLink());
        board.setUserEntity(userEntity);

        board.setOriginFileName(boardDTO.getOriginalFileName());
        board.setStoredFileName(boardDTO.getStoredFileName());

        return board;
    }

    public void bookmarkSaveAndDelete(Board board) {
        if(board.getBookmarkTF() == 0) {
            this.bookmarkTF = 1;
        } else {
            this.bookmarkTF = 0;
        }
    }
}

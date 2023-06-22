package com.demo.login.studylogin.dto;

import com.demo.login.studylogin.domain.boards.BoardEntity;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@NoArgsConstructor//기본 생성자
@AllArgsConstructor // 모든 필드를 매개변수로 하는 생성자
public class BoardDTO {
    private Long postNo;
    private Long category;
    private String title;
    private String content;
    private LocalDateTime postDate;
    private int views;
    private String link;
    //유저 정보
    private Long userNo;
    private String userNick;

    //파일 첨부 관련
    private MultipartFile boardFile; //스프링에서 제공하는 interface. 실제 파일을 담아줄 수 있는 역할. save.html -> Controller 파일 담는 용도
    private String originalFileName; // 원본 파일 이름
    private String storedFileName; // 서버 저장용 파일 이름

    public BoardDTO(Long postNo, String userNick, String title, int views, LocalDateTime postDate) {
        this.postNo = postNo;
        this.userNick = userNick;
        this.title = title;
        this.views = views;
        this.postDate = postDate;
    }

    //게시글 조회할 때 Entity -> DTO 변환
    public static BoardDTO toBoardDTO(BoardEntity boardEntity) {
        BoardDTO boardDTO = new BoardDTO();

        boardDTO.setPostNo(boardEntity.getPostNo());
        boardDTO.setCategory(boardEntity.getCategory());
        boardDTO.setTitle(boardEntity.getTitle());
        boardDTO.setContent(boardEntity.getContent());
        boardDTO.setPostDate(boardEntity.getPostDate());
        boardDTO.setViews(boardEntity.getViews());
        boardDTO.setLink(boardEntity.getLink());
        boardDTO.setUserNo(boardEntity.getUserEntity().getUserNo());
        boardDTO.setUserNick(boardEntity.getUserEntity().getUserNick());

        // 파일 첨부 관련
        boardDTO.setOriginalFileName(boardEntity.getOriginFileName());
        boardDTO.setStoredFileName(boardEntity.getStoredFileName());

        return boardDTO;
    }

}

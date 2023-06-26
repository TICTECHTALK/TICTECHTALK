package com.demo.login.studylogin.dto;

import com.demo.login.studylogin.domain.boards.Comment;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class CommentDto {

    private Long cmId; //댓글 번호 (pk)
    private String cmContent; //댓글내용
    private LocalDateTime cmDate; //댓글 작성시간

    private Long postNo; //댓글 달린 게시판 번호

    private Long userNo;
    private String userNick;

    ///////////////////
    private Long totalLikeNum;

    public CommentDto(Long cmId, Long postNo, Long totalLikeNum, String cmContent, LocalDateTime cmDate, String userNick) {
        this.cmId = cmId;
        this.postNo = postNo;
        this.totalLikeNum = totalLikeNum;
        this.cmContent = cmContent;
        this.cmDate = cmDate;
        this.userNick = userNick;
    }

    ///////////////////
    public static CommentDto toCommentDTO(Comment comment, Long postNo, Long totalLikeNum) {
        CommentDto commentDTO = new CommentDto();

        commentDTO.setCmId(comment.getCmId());
        commentDTO.setCmContent(comment.getCmContent());
        commentDTO.setCmDate(comment.getCmDate());
        commentDTO.setPostNo(postNo);
        commentDTO.setUserNo(comment.getUserEntity().getUserNo());
        commentDTO.setUserNick(comment.getUserEntity().getUserNick());

        ///////////////////////////////
        commentDTO.setTotalLikeNum(totalLikeNum);
        //////////////////////////////

        return commentDTO;
    }


    /*
    public CommentDTO(String cmContent, Long postNo) {
        this.cmContent = cmContent;
        this.postNo = postNo;
    }

    public static CommentDTO toCommentDTO(CommentEntity commentEntity, Long postNo) {
        CommentDTO commentDTO = new CommentDTO(commentEntity.getCmContent(), postNo);

        commentDTO.setCmId(commentEntity.getCmId());
        commentDTO.setCmContent(commentEntity.getCmContent());

        return commentDTO;
    }
    */


}

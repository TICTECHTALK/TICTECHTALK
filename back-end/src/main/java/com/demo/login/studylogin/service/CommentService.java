package com.demo.login.studylogin.service;

import com.demo.login.studylogin.domain.boards.Board;
import com.demo.login.studylogin.domain.boards.Comment;
import com.demo.login.studylogin.domain.members.User;
import com.demo.login.studylogin.dto.CommentDto;
import com.demo.login.studylogin.repository.BoardRepository;
import com.demo.login.studylogin.repository.CommentRepository;
import com.demo.login.studylogin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    //댓글 쓰기
    @Transactional
    public Long save(CommentDto commentDTO) {
        Optional<Board> optionalBoardEntity = boardRepository.findById(commentDTO.getPostNo());
        if (optionalBoardEntity.isPresent()) {
            Optional<User> optionalUserEntity = userRepository.findById(commentDTO.getUserNo());
            User userEntity = optionalUserEntity.get();
            Board board = optionalBoardEntity.get();
            userEntity.cmPointPlus();
            Comment comment = Comment.toSaveEntity(commentDTO, board, userEntity);
            return commentRepository.save(comment).getCmId();
        } else {
            return null;
        }
    }

    //댓글 조회
    @Transactional
    public Page<CommentDto> findAll(Long postNo, Pageable pageable) {
        int page = pageable.getPageNumber();
        int pageSize = pageable.getPageSize();

        pageable = PageRequest.of(page, pageSize, Sort.by(Sort.Direction.ASC,"cmId"));

        Board board = boardRepository.findById(postNo).get();

        Page<Comment> commentList = commentRepository.findAllByBoardOrderByCmIdAsc(board,pageable);

        Page<CommentDto> commentDtoList = commentList.map(comment-> new CommentDto(
                comment.getCmId(),
                comment.getBoard().getPostNo(),
                comment.getTotalLikeNum(),
                comment.getCmContent(),
                comment.getCmDate(),
                comment.getUserEntity().getUserNick()));

        return commentDtoList;
    }


    //댓글 삭제
    @Transactional
    public void delete(Long cmId) {
        commentRepository.deleteById(cmId);
    }

    @Transactional
    public CommentDto findById(Long cmId) {
        Optional<Comment> optionalCommentEntity = commentRepository.findById(cmId);
        if (optionalCommentEntity.isPresent()) {
            Comment comment = optionalCommentEntity.get();
            Long postNo = comment.getBoard().getPostNo();
            return CommentDto.toCommentDTO(comment, postNo, comment.getTotalLikeNum());
        } else {
            return null;
        }
    }

    @Transactional
    public ResponseEntity<?> saveLike(Long cmId) {
        Comment commentEntity = new Comment();

        try {
            commentEntity = (commentRepository.findById(cmId)).get();
        } catch(Exception e) {
            return ResponseEntity.ok("COMMENT_NOT_FOUND");
        }

        Long postNo = commentEntity.getBoard().getPostNo();

        commentEntity.likeSaveAndDelete(commentEntity);
        commentEntity.totalLikeNumPlus();

        commentRepository.save(commentEntity);

        CommentDto comment = CommentDto.toCommentDTO(commentEntity, postNo, commentEntity.getTotalLikeNum());
        return ResponseEntity.ok(comment);
    }

    @Transactional
    public ResponseEntity<?> disLike(Long cmId) {
        Comment commentEntity = new Comment();

        try {
            commentEntity = (commentRepository.findById(cmId)).get();
        } catch(Exception e) {
            return ResponseEntity.ok("COMMENT_NOT_FOUND");
        }

        Long postNo = commentEntity.getBoard().getPostNo();

        commentEntity.likeSaveAndDelete(commentEntity);
        commentEntity.totalLikeNumMinus();

        commentRepository.save(commentEntity);

        CommentDto comment = CommentDto.toCommentDTO(commentEntity, postNo, commentEntity.getTotalLikeNum());
        return ResponseEntity.ok(comment);
    }

    @Transactional
    public ResponseEntity<CommentDto> getComment(Long cmId) {
        Comment commentEntity = (commentRepository.findById(cmId)).get();
        Long postNo = commentEntity.getBoard().getPostNo();
        CommentDto comment = CommentDto.toCommentDTO(commentEntity, postNo, commentEntity.getTotalLikeNum());
        return ResponseEntity.ok(comment);
    }

}

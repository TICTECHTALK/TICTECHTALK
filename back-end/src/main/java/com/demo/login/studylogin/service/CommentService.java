package com.demo.login.studylogin.service;

import com.demo.login.studylogin.domain.boards.BoardEntity;
import com.demo.login.studylogin.domain.boards.CommentEntity;
import com.demo.login.studylogin.domain.members.User;
import com.demo.login.studylogin.dto.CommentDTO;
import com.demo.login.studylogin.repository.BoardRepository;
import com.demo.login.studylogin.repository.CommentRepository;
import com.demo.login.studylogin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    public Long save(CommentDTO commentDTO) {
        Optional<BoardEntity> optionalBoardEntity = boardRepository.findById(commentDTO.getPostNo());
        if (optionalBoardEntity.isPresent()) {
            Optional<User> optionalUserEntity = userRepository.findById(commentDTO.getUserNo());
            User userEntity = optionalUserEntity.get();
            BoardEntity boardEntity = optionalBoardEntity.get();
            CommentEntity commentEntity = CommentEntity.toSaveEntity(commentDTO, boardEntity, userEntity);
            return commentRepository.save(commentEntity).getCmId();
        } else {
            return null;
        }
    }

    //댓글 조회
    @Transactional
    public List<CommentDTO> findAll(Long postNo) {

        BoardEntity boardEntity = boardRepository.findById(postNo).get();

        List<CommentEntity> commentEntityList = commentRepository.findAllByBoardEntityOrderByCmIdDesc(boardEntity);

        List<CommentDTO> commentDTOList = new ArrayList<>();

        for(CommentEntity commentEntity : commentEntityList){
            commentDTOList.add(CommentDTO.toCommentDTO(commentEntity, postNo, commentEntity.getTotlaLikeNum()));
        }

        return commentDTOList;
    }


    //댓글 삭제
    public void delete(Long cmId) {
        commentRepository.deleteById(cmId);
    }

    public CommentDTO findById(Long cmId) {
        Optional<CommentEntity> optionalCommentEntity = commentRepository.findById(cmId);
        if (optionalCommentEntity.isPresent()) {
            CommentEntity commentEntity = optionalCommentEntity.get();
            Long postNo = commentEntity.getBoardEntity().getPostNo();
            return CommentDTO.toCommentDTO(commentEntity, postNo, commentEntity.getTotlaLikeNum());
        } else {
            return null;
        }
    }

    @Transactional
    public ResponseEntity<?> saveLike(Long cmId) {
        CommentEntity commentEntity = new CommentEntity();

        try {
            commentEntity = (commentRepository.findById(cmId)).get();
        } catch(Exception e) {
            return ResponseEntity.ok("COMMENT_NOT_FOUND");
        }

        Long postNo = commentEntity.getBoardEntity().getPostNo();

        commentEntity.likeSaveAndDelete(commentEntity);
        commentEntity.totalLikeNumPlus();

        commentRepository.save(commentEntity);

        CommentDTO comment = CommentDTO.toCommentDTO(commentEntity, postNo, commentEntity.getTotlaLikeNum());
        return ResponseEntity.ok(comment);
    }

    @Transactional
    public ResponseEntity<?> disLike(Long cmId) {
        CommentEntity commentEntity = new CommentEntity();

        try {
            commentEntity = (commentRepository.findById(cmId)).get();
        } catch(Exception e) {
            return ResponseEntity.ok("COMMENT_NOT_FOUND");
        }

        Long postNo = commentEntity.getBoardEntity().getPostNo();

        commentEntity.likeSaveAndDelete(commentEntity);
        commentEntity.totalLikeNumMinus();

        commentRepository.save(commentEntity);

        CommentDTO comment = CommentDTO.toCommentDTO(commentEntity, postNo, commentEntity.getTotlaLikeNum());
        return ResponseEntity.ok(comment);
    }

    @Transactional
    public ResponseEntity<CommentDTO> getComment(Long cmId) {
        CommentEntity commentEntity = (commentRepository.findById(cmId)).get();
        Long postNo = commentEntity.getBoardEntity().getPostNo();
        CommentDTO comment = CommentDTO.toCommentDTO(commentEntity, postNo, commentEntity.getTotlaLikeNum());
        return ResponseEntity.ok(comment);
    }
}

package com.demo.login.studylogin.repository;


import com.demo.login.studylogin.domain.boards.BoardEntity;
import com.demo.login.studylogin.domain.boards.CommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Long> {

    //댓글 조회 기능 => boardEntity(postNo)를 기준으로 cmId 내림차순으로 댓글 findAll
    List<CommentEntity> findAllByBoardEntityOrderByCmIdDesc(BoardEntity boardEntity);

}

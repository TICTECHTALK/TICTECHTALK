package com.demo.login.studylogin.repository;


import com.demo.login.studylogin.domain.boards.Comment;
import com.demo.login.studylogin.domain.boards.ReCm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReCmRepository extends JpaRepository<ReCm, Long> {

    //대댓글 조회 기능 => CommentEntity(cmId)를 기준으로 cmId 내림차순으로 댓글 findAll
    List<ReCm> findByCommentOrderByRecmIdDesc(Comment comment);
}

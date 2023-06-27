package com.demo.login.studylogin.repository;

import com.demo.login.studylogin.domain.boards.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {

    Like findByUserNoAndCmId(Long userNo, Long cmId);

    void deleteByCmIdAndUserNo(Long cmId, Long userNo);
}

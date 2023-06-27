package com.demo.login.studylogin.repository;

import com.demo.login.studylogin.domain.members.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    List<Bookmark> findByUserNo(Long userNo);

    Bookmark findByUserNoAndPostNo(Long userNo, Long postNo);

    void deleteByPostNoAndUserNo(Long postNo, Long userNo);
}

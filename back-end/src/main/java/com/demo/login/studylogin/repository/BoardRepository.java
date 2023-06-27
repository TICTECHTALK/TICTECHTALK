package com.demo.login.studylogin.repository;

import com.demo.login.studylogin.domain.boards.Board;
import com.demo.login.studylogin.domain.members.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.Optional;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {


     /*
      조회수 처리
      update board_table set board_views = board_views+1 where post_no=?
      */
    @Modifying
    @Query(value="update Board b set b.views=b.views+1 where b.postNo=:postNo")
    void updateViews(@Param("postNo") Long postNo);

    //검색 기능
    Page<Board> findByTitleContaining(String searchKeyword, Pageable pageable);

    //해당 회원 글의 수정
    Optional<Board> findByPostNoAndUserEntity(Long postNo, User userEntity);

    //카테고리별로 게시글 리스트 조회
    Page<Board> findAllByCategory(Long category, Pageable pageable);


}

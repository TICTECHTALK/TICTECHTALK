package com.demo.login.studylogin.repository;

import com.demo.login.studylogin.domain.members.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findById(Long userNo);

    Optional<User> findByUserEmail(String userEmail);

    Optional<User> findByUserNick(String userNick);

}

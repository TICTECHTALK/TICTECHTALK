package com.demo.login.studylogin.repository;

import com.demo.login.studylogin.domain.members.RefreshToken;
import com.demo.login.studylogin.domain.members.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findById(Long userNo);

    Optional<RefreshToken> findByUser(User user);
}

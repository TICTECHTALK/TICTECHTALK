package com.demo.login.studylogin.service;

import com.demo.login.studylogin.Utils.JwtTokenUtil;
import com.demo.login.studylogin.domain.members.User;
import com.demo.login.studylogin.dto.TokenDto;
import com.demo.login.studylogin.dto.UserJoinRequest;
import com.demo.login.studylogin.dto.UserLoginRequest;
import com.demo.login.studylogin.dto.UserResponseDto;
import com.demo.login.studylogin.exception.AppException;
import com.demo.login.studylogin.exception.ErrorCode;
import com.demo.login.studylogin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JwtTokenUtil jwtTokenUtil;
    private final BCryptPasswordEncoder encoder;

    @Transactional
    public ResponseEntity<?> join(UserJoinRequest dto) {

        //userEmail 중복 체크
        userRepository.findByUserEmail(dto.getUserEmail())
            .ifPresent(user -> {
                throw new AppException(ErrorCode.USEREMAIL_DUPLICATED, dto.getUserEmail() + "는 이미 있습니다.");
            });
        //nickname 중복 체크
        userRepository.findByUserNick(dto.getUserNick())
            .ifPresent(user -> {
                throw new AppException(ErrorCode.NICKNAME_DUPLICATED, dto.getUserNick() + "는 이미 있습니다.");
            });

        //저장
        User user = User.builder()
                .userEmail(dto.getUserEmail())
                .userNick(dto.getUserNick())
                .password(encoder.encode(dto.getPassword()))
                .build();
        userRepository.save(user);

        return ResponseEntity.ok(
                UserResponseDto.builder()
                        .userNo(user.getUserNo())
                        .userEmail(user.getUserEmail())
                        .userNick(user.getUserNick())
                        .build()
        );

    }

    @Transactional
    public ResponseEntity<?> login(UserLoginRequest dto, HttpServletResponse response) {

        //userEmail 없음
        User user = userRepository.findByUserEmail(dto.getUserEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USEREMAIL_NOT_FOUND, ""));


        //password 없음
        if(!encoder.matches(dto.getPassword(), user.getPassword())) {
            log.info(user.getPassword());
            return ResponseEntity.ok("INVALID_PASSWORD");
        }
        TokenDto tokenDto = jwtTokenUtil.generateTokenDto(user);
        jwtTokenUtil.tokenToHeaders(tokenDto, response);

        return ResponseEntity.ok(
                UserResponseDto.builder()
                        .userNo(user.getUserNo())
                        .userEmail(user.getUserEmail())
                        .userNick(user.getUserNick())
                        .build()
        );
    }

    @Transactional
    public ResponseEntity<?> logout(HttpServletRequest request) {
        // 토큰을 통해 실제 사용자가 DB상에 존재하는지 확인
        User user = jwtTokenUtil.getUserFromAuthentication();
        if (null == user) {
            return ResponseEntity.ok("USER_NOT_FOUND");
        }
        jwtTokenUtil.deleteRefreshToken(user);
        return ResponseEntity.ok("로그아웃 성공");
    }

    @Transactional
    public ResponseEntity<?> delete(HttpServletRequest request) {
        // 토큰을 통해 실제 사용자가 DB상에 존재하는지 확인
        User user = jwtTokenUtil.getUserFromAuthentication();
        if (null == user) {
            return ResponseEntity.ok("USER_NOT_FOUND");
        }
        System.out.println("delete() 직전");
        userRepository.delete(user);

        return ResponseEntity.ok().body("회원탈퇴가 완료되었습니다.");
    }
}

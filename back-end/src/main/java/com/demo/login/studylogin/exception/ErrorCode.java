package com.demo.login.studylogin.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Getter
public enum ErrorCode {

    //에러 핸들링을 위한 에러 코드 모음

    //Users
    USEREMAIL_DUPLICATED(HttpStatus.CONFLICT, "USER-001", ""),
    USEREMAIL_NOT_FOUND(HttpStatus.NOT_FOUND, "USER-002", ""),
    NICKNAME_DUPLICATED(HttpStatus.CONFLICT, "USER-003", ""),
    INVALID_PASSWORD(HttpStatus.UNAUTHORIZED, "USER-004", ""),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "USER-005", ""),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "USER-006", ""),

    //추가된 코드
    BOARD_NOT_FOUND(HttpStatus.NOT_FOUND, "BOARD-001", ""),
    COMMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "COMMENT-001", ""),

    //JWT
    JWT_ACCESS_TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "TOKEN-001", "액세스 토큰이 만료되었습니다."),
    JWT_REFRESH_TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "TOKEN-002", "리프레시 토큰이 만료되었습니다."),
    REFRESH_TOKEN_NOT_FOUND(HttpStatus.NOT_FOUND, "TOKEN-003", ""),
    REFRESH_TOKEN_ALREADY_EXISTS(HttpStatus.CONFLICT, "TOKEN-004", "")
    ;


    private HttpStatus httpStatus;
    private String code;
    private String message;
}

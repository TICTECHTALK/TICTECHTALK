package com.demo.login.studylogin.common;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Builder
@Getter
@Setter
public class ResponseVO<T> {

    private HttpStatus status;
    private String message;
    private Object response;
    private String code;

}

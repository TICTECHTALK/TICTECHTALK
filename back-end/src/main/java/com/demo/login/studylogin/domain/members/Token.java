package com.demo.login.studylogin.domain.members;

import lombok.*;
import org.springframework.stereotype.Indexed;

import javax.persistence.Id;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Token {

    @Id
    private String key;
    private String value;
    private Long expiredTime;


}

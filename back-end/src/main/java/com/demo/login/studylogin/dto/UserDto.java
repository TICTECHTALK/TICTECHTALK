package com.demo.login.studylogin.dto;

import com.demo.login.studylogin.domain.members.User;
import lombok.*;

import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    @NotBlank
    private String userEmail;

    @NotBlank
    private String password;

    private Long UserNo;
    private String userNick;

    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

}

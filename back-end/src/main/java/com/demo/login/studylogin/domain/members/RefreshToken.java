package com.demo.login.studylogin.domain.members;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.*;

import javax.persistence.*;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "TOKENTABLE")
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tokenId;
    @Column
    private String refreshToken;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "userNo")
    private User user;


    public void setUser(User user) {
        this.user = user;
    }

    //토큰 재발급에 사용
    public void updateToken(String token) {
        this.refreshToken = token;
    }

}

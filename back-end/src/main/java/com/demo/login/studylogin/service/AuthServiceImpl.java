package com.demo.login.studylogin.service;

import com.demo.login.studylogin.Utils.JwtTokenUtil;
import com.demo.login.studylogin.domain.members.RefreshToken;
import com.demo.login.studylogin.domain.members.User;
import com.demo.login.studylogin.dto.TokenDto;
import com.demo.login.studylogin.exception.AppException;
import com.demo.login.studylogin.exception.ErrorCode;
import com.demo.login.studylogin.repository.UserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService{

    //토큰 재발급 로직

    @Value("${jwt.secret}")
    private String secretKey;

    private final JwtTokenUtil jwtTokenUtil;
    private final UserRepository userRepository;

    @Override
    public User getAuth(HttpServletRequest request) {
        String token = jwtTokenUtil.resolveToken(request);

        if(StringUtils.hasText(token)) {
            Authentication authentication = jwtTokenUtil.getAuthentication(token);
            return (User) authentication.getPrincipal();
        }else  {
            return null;
        }
    }

    @Override
    public ResponseEntity<String> reissue(HttpServletRequest request, HttpServletResponse response) {
        try {

            // 엑세스 토큰안에 담긴 정보를 이용해 DB상에 실제 사용자가 존재하는지 확인
            String accessToken = jwtTokenUtil.resolveToken(request);
            log.info(accessToken);
            System.out.println("reissue 서버 시작");

            User user = userRepository.findByUserEmail(jwtTokenUtil.getClaimsUserEmail(accessToken)).get();
            log.info(user.getUserEmail());
            if (null == user) {
                throw new AppException(ErrorCode.USEREMAIL_NOT_FOUND, "사용자를 찾을 수 없습니다.");

            }

            // 리프레시 토큰 유효성 검증
            RefreshToken refreshToken = jwtTokenUtil.isPresentRefreshToken(user);
            log.info(String.valueOf(refreshToken));
            if (!refreshToken.getRefreshToken().equals(request.getHeader("RefreshToken"))) {
                throw new AppException(ErrorCode.JWT_REFRESH_TOKEN_EXPIRED, "토큰이 유효하지 않습니다.");
            }

            // 위 과정을 다 통과하면 새로운 토큰을 만들어 response에 담아 보냄
            TokenDto tokenDto = jwtTokenUtil.generateTokenDto(user);
            refreshToken.updateToken(tokenDto.getRefreshToken());
            // 리프레시 토큰도 새로 발급해 DB에 저장
            jwtTokenUtil.tokenToHeaders(tokenDto, response);
            System.out.println("재발급 완료");
            return ResponseEntity.ok().body("토큰 재발급이 완료되었습니다.");


        } catch(ExpiredJwtException e) {
            throw new AppException(ErrorCode.JWT_REFRESH_TOKEN_EXPIRED, "");
        }
    }

}

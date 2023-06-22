package com.demo.login.studylogin.Utils;

import com.demo.login.studylogin.domain.members.RefreshToken;
import com.demo.login.studylogin.domain.members.Role;
import com.demo.login.studylogin.domain.members.User;
import com.demo.login.studylogin.dto.TokenDto;
import com.demo.login.studylogin.exception.AppException;
import com.demo.login.studylogin.exception.ErrorCode;
import com.demo.login.studylogin.impl.UserDetailsImpl;
import com.demo.login.studylogin.repository.RefreshTokenRepository;
import io.jsonwebtoken.*;

import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.security.Key;
import java.util.*;

//토큰과 관련된 모든 로직이 존재
@Slf4j
@Component
public class JwtTokenUtil {


    @Value("${jwt.header}")
    private String jwtHeader;

    private final UserDetailsService userDetailsService;
    private final RefreshTokenRepository refreshTokenRepository;

    //액세스 토큰 만료 시간
    private static final long accessTokenExpireMs = 1000 * 60 * 60;

    //리프레시 토큰 만료 시간 (2주)
    private static final long refreshTokenExpireMs = 1000 * 60 * 60 * 24 * 14;
    //토큰 서명 키
    private final Key key;

    //기본 생성자
    public JwtTokenUtil(@Value("${jwt.secret}") String secretKey, UserDetailsService userDetailsService, RefreshTokenRepository refreshTokenRepository) {
        this.userDetailsService = userDetailsService;
        this.refreshTokenRepository = refreshTokenRepository;
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }


    // 엑세스 토큰 안에서 userEmail를 꺼내오기 위한 메서드
    public String getClaimsUserEmail(String accessToken) {
        Claims claims = parseClaims(accessToken);
        if (claims.get("auth") == null) {
            throw new RuntimeException("권한 정보가 없는 토큰입니다.");
        }

        return claims.getSubject();
    }

    //액세스 토큰에서 userNo 추출하는 로직
    public Long getUserNoFromToken(HttpServletRequest request) {
        String token = resolveToken(request);
        if (StringUtils.hasText(token)) {
            Claims claims = parseClaims(token);
            if (claims.get("userNo") != null) {
                return Long.parseLong(claims.get("userNo").toString());
            }
        }
        return null;
    }



    // 토큰 생성
    public TokenDto generateTokenDto(User user) {
        long now = (new Date().getTime());

        // 생성 시간
        Date accessTokenExpiresIn = new Date(now + accessTokenExpireMs);

        //액세스 토큰 생성
        String accessToken = Jwts.builder()
                .setSubject(user.getUserEmail())
                .claim("userNo", user.getUserNo())
                .claim("userNick", user.getUserNick())
                /*
                "auth"는 커스텀 claim으로 유저의 authorities를 Authentication 객체에서 가져와
                 쉼표로 구분된 문자열로 만들어주고 액세스 토큰의 payload에 넣어준다.
                 사용자의 권한 검증을 편리하게 하기 위해 만든것
                 */
                .claim("auth", Role.ROLE_USER.toString())
                .setExpiration(accessTokenExpiresIn)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();


        //리프레쉬 토큰 생성
        String refreshToken = Jwts.builder()
                .setExpiration(new Date(now + refreshTokenExpireMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        //리프레시 토큰에 사용자 정보를 담아 DB에 저장
        RefreshToken refreshTokenObject = RefreshToken.builder()
                .tokenId(user.getUserNo())
                .user(user)
                .refreshToken(refreshToken)
                .build();

        refreshTokenRepository.save(refreshTokenObject);

        // TokenDto객체를 생성해 위의 정보들을 하나하나 담아 리턴한다.
        return TokenDto.builder()
                //Authorization은 "Bearer 토큰"의 형태로 빌드
                .grantType("Bearer ")
                .accessToken(accessToken)
                .accessTokenExpiresIn(accessTokenExpiresIn.getTime())
                .refreshToken(refreshToken)
                .build();
    }

    // 토큰을 헤더에 보낼때 어떤 정보들을 담아 보낼지에 대한 메서드
    public void tokenToHeaders(TokenDto tokenDto, HttpServletResponse response) {
        response.addHeader("Authorization", "Bearer " + tokenDto.getAccessToken());
        response.addHeader("RefreshToken", tokenDto.getRefreshToken());
        response.addHeader("Access-Token-Expire-Time", tokenDto.getAccessTokenExpiresIn().toString());
    }

    // JWT 토큰에서 인증 정보 조회
    public Authentication getAuthentication(String token) {
        HashMap<String, String> payloadMap = JwtUtil.getPayloadByToken(token);
        UserDetails userDetails = userDetailsService.loadUserByUsername(payloadMap.get("sub"));
        return new UsernamePasswordAuthenticationToken(userDetails, token, userDetails.getAuthorities());
    }


    //토큰 안에 담긴 user 정보를 추출하기 위한 코드
    public User getUserFromAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("authentication: " + authentication);
        if (authentication == null || AnonymousAuthenticationToken.class.
                isAssignableFrom(authentication.getClass())) {
            return null;
        }
        return ((UserDetailsImpl) authentication.getPrincipal()).getUser();
    }

    // HTTP Request의 Header에서 Bearer 글자를 떼고 토큰값만 받아오기 위한 메서드
    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    // User 객체를 파라미터로 받아 DB에 토큰이 있는지 확인하기 위한 코드
    @Transactional(readOnly = true)
    public RefreshToken isPresentRefreshToken(User user) {
        Optional<RefreshToken> optionalRefreshToken = refreshTokenRepository.findByUser(user);
        return optionalRefreshToken.orElse(null);
    }

    //DB상에서 리프레시 토큰이 있는지 확인 후 테이블에서 삭제하는 로직
    @Transactional
    public ResponseEntity<?> deleteRefreshToken(User user) {
        RefreshToken refreshToken = isPresentRefreshToken(user);
        if (null == refreshToken) {
            throw new AppException(ErrorCode.REFRESH_TOKEN_NOT_FOUND, "존재하지 않는 토큰입니다.");
        }

        refreshTokenRepository.delete(refreshToken);
        return ResponseEntity.ok().body("로그아웃 되었습니다.");
    }

    // 토큰 정보를 검증하는 메서드
    public boolean validateToken(String token, HttpServletRequest request) {
        try {
//            Jwts.parser().setSigningKey(key).parseClaimsJws(token);
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
            return true;
        } catch(SecurityException | MalformedJwtException e) {
            log.error("Invalid JWT signature");
            return false;
        } catch(UnsupportedJwtException e) {
            log.error("Unsupported JWT token");
            return false;
        } catch(IllegalArgumentException e) {
            log.error("JWT token is invalid");
            return false;
        }
    }


    // 엑세스 토큰의 복호화를 위한 코드
    private Claims parseClaims(String token) {
        try {
            return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

}

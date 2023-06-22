package com.demo.login.studylogin.configuration;

import com.demo.login.studylogin.Utils.JwtTokenUtil;
import com.demo.login.studylogin.common.ResponseVO;
import com.demo.login.studylogin.exception.ErrorCode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtTokenUtil jwtTokenUtil;

    //리퀘스트 필터로 모든 리퀘스트는 이 필터를 지나감. 여기서 토큰이 검증되지 않으면 에러를 반환.

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            String path = request.getServletPath();

            if (path.startsWith("/users/reissue")) {
                filterChain.doFilter(request, response);
            } else {
                String accessToken = jwtTokenUtil.resolveToken(request);
                boolean isTokenValid = jwtTokenUtil.validateToken(accessToken, request);

                if (StringUtils.hasText(accessToken) && isTokenValid) {
                    System.out.println(accessToken);
                    this.setAuthentication(accessToken);
                }

                filterChain.doFilter(request, response);
            }

        } catch (ExpiredJwtException e) {
            ResponseVO responseVO = ResponseVO.builder()
                    .status(ErrorCode.JWT_ACCESS_TOKEN_EXPIRED.getHttpStatus())
                    .message(ErrorCode.JWT_ACCESS_TOKEN_EXPIRED.getMessage())
                    .code(ErrorCode.JWT_ACCESS_TOKEN_EXPIRED.getCode())
                    .build();

            response.setStatus(ErrorCode.JWT_ACCESS_TOKEN_EXPIRED.getHttpStatus().value());
            response.getWriter().write(new ObjectMapper().writeValueAsString(responseVO));
            response.getWriter().flush();
        }

    }
    // SecurityContext에 Authentication 저장
    private void setAuthentication(String token) {
        Authentication authentication = jwtTokenUtil.getAuthentication(token);
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}





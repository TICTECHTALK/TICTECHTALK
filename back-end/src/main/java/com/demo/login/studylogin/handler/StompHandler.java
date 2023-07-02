package com.demo.login.studylogin.handler;

import com.demo.login.studylogin.Utils.JwtTokenUtil;
import com.demo.login.studylogin.configuration.JwtFilter;
import io.jsonwebtoken.MalformedJwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
@Slf4j
@RequiredArgsConstructor
public class StompHandler implements ChannelInterceptor {

    private final JwtTokenUtil jwtTokenUtil;
    private final JwtFilter jwtFilter;
    private static final String BEARER_PREFIX = "Bearer ";


    @Override
    public Message<?> preSend(@Payload Message<?> message, MessageChannel channel) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(message);

        // message 헤더 토큰 얻기
        String authorizationHeader = String.valueOf(headerAccessor.getNativeHeader("Authorization"));
        log.info(authorizationHeader);

        if (authorizationHeader == null || authorizationHeader.equals("null")) {
            throw new MessageDeliveryException("메세지 예외");
        }

        String token = authorizationHeader.substring(BEARER_PREFIX.length());

        // 토큰 인증
        try {
            boolean isTokenValid = jwtTokenUtil.validateToken(token);

            if (StringUtils.hasText(token) && isTokenValid) {
                this.jwtFilter.setAuthentication(token);
            }

        } catch (MessageDeliveryException e) {
            throw new MessageDeliveryException("메세지 에러");
        } catch (MalformedJwtException e) {
            throw new MessageDeliveryException("Invalid JWT signature");
        }
        return message;
    }
}
package com.demo.login.studylogin.handler;

import com.demo.login.studylogin.Utils.JwtTokenUtil;
import com.demo.login.studylogin.configuration.JwtFilter;
import com.demo.login.studylogin.service.ChatService;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    private final ChatService chatService;
    private final ObjectMapper objectMapper;
    private static final String BEARER_PREFIX = "Bearer ";


    @Override
    public Message<?> preSend(@Payload Message<?> message, MessageChannel channel) {
        log.info("presend Message::" + message.getPayload());
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(message);

        // message 헤더 토큰 얻기
        String authorizationHeader = String.valueOf(headerAccessor.getNativeHeader("Authorization"));
        log.info(authorizationHeader);

        if (authorizationHeader == null || authorizationHeader.equals("null")) {
            throw new MessageDeliveryException("메세지 예외");
        }

        String token = authorizationHeader.substring(BEARER_PREFIX.length());
        log.info("헤더토큰::" + token);
        // 토큰 인증
        try {
            boolean isTokenValid = jwtTokenUtil.validateToken(token);

            if (StringUtils.hasText(token) && isTokenValid) {
                this.jwtFilter.setAuthentication(token);

//                // Extract the chat message from the Stomp payload
//                Object payload = message.getPayload();
//                log.info("메세지 getPayLoad::" + payload.toString());
//                if (payload instanceof byte[]) {
//                    String chatMessage = objectMapper.readValue((byte[]) payload, String.class);
//                    log.info(chatMessage);
//                    chatService.saveChatMessage(chatMessage);
//                } else if (payload instanceof String) {
//                    chatService.saveChatMessage((String) payload);
//                } else {
//                    throw new IllegalArgumentException("Invalid payload type: " + payload.getClass().getSimpleName());
//                }

            }

        } catch (MessageDeliveryException e) {
            throw new MessageDeliveryException("메세지 에러");
        } catch (MalformedJwtException e) {
            throw new MessageDeliveryException("Invalid JWT signature");
        }
        log.info("message.getHeaders() :: " + message.getHeaders());
        return message;
    }
}
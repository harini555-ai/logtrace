package com.logtrace.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // In-memory simple broker for topics that clients subscribe to
        registry.enableSimpleBroker("/topic");
        // Prefix for messages bound for @MessageMapping methods (not heavily used here,
        // ingestion happens over REST, but kept for future client->server messaging)
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-logtrace")
                .setAllowedOriginPatterns("*")
                .withSockJS();

        // Also expose a raw (non-SockJS) endpoint for native WebSocket clients
        registry.addEndpoint("/ws-logtrace")
                .setAllowedOriginPatterns("*");
    }
}

package com.logtrace.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.logtrace.dto.ApiResponse;
import com.logtrace.entity.AppService;
import com.logtrace.repository.AppServiceRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

/**
 * Validates the X-API-KEY header for log ingestion requests and attaches the
 * resolved AppService onto the request so downstream controllers don't need
 * to re-query the database.
 */
@Component
@RequiredArgsConstructor
public class ApiKeyAuthFilter extends OncePerRequestFilter {

    public static final String API_KEY_HEADER = "X-API-KEY";
    public static final String RESOLVED_SERVICE_ATTR = "resolvedAppService";

    private final AppServiceRepository appServiceRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // Only guard the ingestion endpoint(s); everything else (dashboard reads,
        // websocket handshake, service management) is left open for the frontend.
        String path = request.getRequestURI();
        return !path.startsWith("/api/logs/ingest");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String apiKey = request.getHeader(API_KEY_HEADER);

        if (apiKey == null || apiKey.isBlank()) {
            writeUnauthorized(response, "Missing X-API-KEY header");
            return;
        }

        Optional<AppService> serviceOpt = appServiceRepository.findByApiKey(apiKey);
        if (serviceOpt.isEmpty()) {
            writeUnauthorized(response, "Invalid API key");
            return;
        }

        request.setAttribute(RESOLVED_SERVICE_ATTR, serviceOpt.get());
        filterChain.doFilter(request, response);
    }

    private void writeUnauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write(objectMapper.writeValueAsString(ApiResponse.error(message)));
    }
}

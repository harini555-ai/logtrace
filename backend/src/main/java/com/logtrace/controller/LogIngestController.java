package com.logtrace.controller;

import com.logtrace.dto.ApiResponse;
import com.logtrace.dto.LogEntryResponse;
import com.logtrace.dto.LogIngestRequest;
import com.logtrace.entity.AppService;
import com.logtrace.exception.InvalidApiKeyException;
import com.logtrace.security.ApiKeyAuthFilter;
import com.logtrace.service.LogIngestionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoint used by client microservices to push application logs.
 * Requires an X-API-KEY header issued when the service was registered
 * (see {@link ServiceController}). Validated by {@link ApiKeyAuthFilter}.
 */
@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class LogIngestController {

    private final LogIngestionService logIngestionService;

    @PostMapping("/ingest")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<LogEntryResponse> ingest(@Valid @RequestBody LogIngestRequest request,
                                                 HttpServletRequest httpRequest) {

        AppService resolvedService = (AppService) httpRequest.getAttribute(ApiKeyAuthFilter.RESOLVED_SERVICE_ATTR);
        if (resolvedService == null) {
            throw new InvalidApiKeyException("Unable to resolve service for provided API key");
        }

        String clientIp = resolveClientIp(httpRequest);
        LogEntryResponse response = logIngestionService.ingest(resolvedService, request, clientIp);
        return ApiResponse.success("Log ingested", response);
    }

    private String resolveClientIp(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}

package com.logtrace.service;

import com.logtrace.dto.LogEntryResponse;
import com.logtrace.dto.LogIngestRequest;
import com.logtrace.entity.AppService;
import com.logtrace.entity.LogEntry;
import com.logtrace.repository.LogEntryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class LogIngestionService {

    private final LogEntryRepository logEntryRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public LogEntryResponse ingest(AppService service, LogIngestRequest request, String clientIp) {
        LogEntry entry = LogEntry.builder()
                .service(service)
                .level(request.getLevel())
                .message(request.getMessage())
                .stackTrace(request.getStackTrace())
                .endpoint(request.getEndpoint())
                .clientIp(clientIp)
                .timestamp(LocalDateTime.now())
                .build();

        LogEntry saved = logEntryRepository.save(entry);
        LogEntryResponse response = LogEntryResponse.fromEntity(saved);

        broadcast(response, service.getId());

        return response;
    }

    private void broadcast(LogEntryResponse response, Long serviceId) {
        try {
            // Per-service topic
            messagingTemplate.convertAndSend("/topic/logs/" + serviceId, response);
            // Global topic - live tail across all services
            messagingTemplate.convertAndSend("/topic/logs/all", response);
        } catch (Exception ex) {
            log.error("Failed to broadcast log entry over WebSocket: {}", ex.getMessage(), ex);
        }
    }
}

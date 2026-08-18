package com.logtrace.dto;

import com.logtrace.entity.LogEntry;
import com.logtrace.entity.LogLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LogEntryResponse {

    private Long id;
    private Long serviceId;
    private String serviceName;
    private LogLevel level;
    private String message;
    private String stackTrace;
    private String endpoint;
    private String clientIp;
    private LocalDateTime timestamp;

    public static LogEntryResponse fromEntity(LogEntry entry) {
        return LogEntryResponse.builder()
                .id(entry.getId())
                .serviceId(entry.getService() != null ? entry.getService().getId() : null)
                .serviceName(entry.getService() != null ? entry.getService().getServiceName() : null)
                .level(entry.getLevel())
                .message(entry.getMessage())
                .stackTrace(entry.getStackTrace())
                .endpoint(entry.getEndpoint())
                .clientIp(entry.getClientIp())
                .timestamp(entry.getTimestamp())
                .build();
    }
}

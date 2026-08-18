package com.logtrace.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "log_entries", indexes = {
        @Index(name = "idx_log_service_id", columnList = "service_id"),
        @Index(name = "idx_log_level", columnList = "level"),
        @Index(name = "idx_log_timestamp", columnList = "timestamp")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LogEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private AppService service;

    @Enumerated(EnumType.STRING)
    @Column(name = "level", nullable = false, length = 10)
    private LogLevel level;

    @Lob
    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Lob
    @Column(name = "stack_trace", columnDefinition = "LONGTEXT")
    private String stackTrace;

    @Column(name = "endpoint", length = 255)
    private String endpoint;

    @Column(name = "client_ip", length = 64)
    private String clientIp;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @PrePersist
    public void prePersist() {
        if (this.timestamp == null) {
            this.timestamp = LocalDateTime.now();
        }
    }
}

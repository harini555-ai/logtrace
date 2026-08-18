package com.logtrace.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "app_services")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "service_name", nullable = false, length = 150)
    private String serviceName;

    @Column(name = "api_key", nullable = false, unique = true, updatable = false, length = 64)
    private String apiKey;

    @Enumerated(EnumType.STRING)
    @Column(name = "environment", nullable = false, length = 20)
    private Environment environment;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.apiKey == null) {
            this.apiKey = UUID.randomUUID().toString();
        }
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}

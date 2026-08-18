package com.logtrace.dto;

import com.logtrace.entity.AppService;
import com.logtrace.entity.Environment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceResponse {

    private Long id;
    private String serviceName;
    private String apiKey;
    private Environment environment;
    private LocalDateTime createdAt;

    public static ServiceResponse fromEntity(AppService service) {
        return ServiceResponse.builder()
                .id(service.getId())
                .serviceName(service.getServiceName())
                .apiKey(service.getApiKey())
                .environment(service.getEnvironment())
                .createdAt(service.getCreatedAt())
                .build();
    }
}

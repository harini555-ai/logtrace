package com.logtrace.dto;

import com.logtrace.entity.LogLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LogIngestRequest {

    @NotNull(message = "level is required")
    private LogLevel level;

    @NotBlank(message = "message is required")
    private String message;

    private String stackTrace;

    private String endpoint;
}

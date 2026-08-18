package com.logtrace.dto;

import com.logtrace.entity.Environment;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceCreateRequest {

    @NotBlank(message = "serviceName is required")
    private String serviceName;

    @NotNull(message = "environment is required")
    private Environment environment;
}

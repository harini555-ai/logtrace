package com.logtrace.controller;

import com.logtrace.dto.ApiResponse;
import com.logtrace.dto.ServiceCreateRequest;
import com.logtrace.dto.ServiceResponse;
import com.logtrace.service.AppServiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {

    private final AppServiceService appServiceService;

    @PostMapping
    public ApiResponse<ServiceResponse> registerService(@Valid @RequestBody ServiceCreateRequest request) {
        return ApiResponse.success("Service registered successfully", appServiceService.registerService(request));
    }

    @GetMapping
    public ApiResponse<List<ServiceResponse>> getAllServices() {
        return ApiResponse.success(appServiceService.getAllServices());
    }

    @GetMapping("/{id}")
    public ApiResponse<ServiceResponse> getServiceById(@PathVariable Long id) {
        return ApiResponse.success(appServiceService.getServiceById(id));
    }

    @PostMapping("/{id}/regenerate-key")
    public ApiResponse<ServiceResponse> regenerateApiKey(@PathVariable Long id) {
        return ApiResponse.success("API key regenerated", appServiceService.regenerateApiKey(id));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<Void> deleteService(@PathVariable Long id) {
        appServiceService.deleteService(id);
        return ApiResponse.success("Service deleted", null);
    }
}

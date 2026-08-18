package com.logtrace.controller;

import com.logtrace.dto.AnalyticsResponse;
import com.logtrace.dto.ApiResponse;
import com.logtrace.service.LogQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final LogQueryService logQueryService;

    @GetMapping("/summary")
    public ApiResponse<AnalyticsResponse> getSummary(
            @RequestParam(required = false) Long serviceId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to
    ) {
        return ApiResponse.success(logQueryService.getAnalytics(serviceId, from, to));
    }
}

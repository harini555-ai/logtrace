package com.logtrace.controller;

import com.logtrace.dto.ApiResponse;
import com.logtrace.dto.LogEntryResponse;
import com.logtrace.entity.LogLevel;
import com.logtrace.service.LogQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class LogQueryController {

    private final LogQueryService logQueryService;

    @GetMapping
    public ApiResponse<Page<LogEntryResponse>> search(
            @RequestParam(required = false) Long serviceId,
            @RequestParam(required = false) List<LogLevel> levels,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "timestamp"));
        Page<LogEntryResponse> result = logQueryService.search(serviceId, levels, query, from, to, pageable);
        return ApiResponse.success(result);
    }
}

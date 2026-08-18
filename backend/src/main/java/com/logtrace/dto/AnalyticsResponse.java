package com.logtrace.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {
    private long totalLogs;
    private long errorCount;
    private long warnCount;
    private long infoCount;
    private long debugCount;
    private Map<String, Long> countsByLevel;
}
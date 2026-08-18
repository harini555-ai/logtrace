package com.logtrace.service;

import com.logtrace.dto.AnalyticsResponse;
import com.logtrace.dto.LogEntryResponse;
import com.logtrace.entity.LogEntry;
import com.logtrace.entity.LogLevel;
import com.logtrace.repository.LogEntryRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class LogQueryService {

    private final LogEntryRepository logEntryRepository;

    @Transactional(readOnly = true)
    public Page<LogEntryResponse> search(Long serviceId,
                                          List<LogLevel> levels,
                                          String query,
                                          LocalDateTime from,
                                          LocalDateTime to,
                                          Pageable pageable) {

        Specification<LogEntry> spec = buildSpecification(serviceId, levels, query, from, to);
        return logEntryRepository.findAll(spec, pageable)
                .map(LogEntryResponse::fromEntity);
    }

    private Specification<LogEntry> buildSpecification(Long serviceId,
                                                         List<LogLevel> levels,
                                                         String query,
                                                         LocalDateTime from,
                                                         LocalDateTime to) {
        return (root, criteriaQuery, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (serviceId != null) {
                predicates.add(cb.equal(root.get("service").get("id"), serviceId));
            }

            if (levels != null && !levels.isEmpty()) {
                predicates.add(root.get("level").in(levels));
            }

            if (query != null && !query.isBlank()) {
                String likePattern = "%" + query.toLowerCase() + "%";
                Predicate messageMatch = cb.like(cb.lower(root.get("message")), likePattern);
                Predicate stackTraceMatch = cb.like(cb.lower(root.get("stackTrace")), likePattern);
                predicates.add(cb.or(messageMatch, stackTraceMatch));
            }

            if (from != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("timestamp"), from));
            }

            if (to != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("timestamp"), to));
            }

            criteriaQuery.orderBy(cb.desc(root.get("timestamp")));

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    @Transactional(readOnly = true)
    public AnalyticsResponse getAnalytics(Long serviceId, LocalDateTime from, LocalDateTime to) {
        List<LogEntryRepository.LevelCountProjection> counts = logEntryRepository.countByLevel(serviceId, from, to);

        Map<String, Long> countsByLevel = new HashMap<>();
        for (LogLevel level : LogLevel.values()) {
            countsByLevel.put(level.name(), 0L);
        }

        long total = 0;
        for (LogEntryRepository.LevelCountProjection projection : counts) {
            countsByLevel.put(projection.getLevel().name(), projection.getTotal());
            total += projection.getTotal();
        }

        return AnalyticsResponse.builder()
                .totalLogs(total)
                .errorCount(countsByLevel.getOrDefault("ERROR", 0L))
                .warnCount(countsByLevel.getOrDefault("WARN", 0L))
                .infoCount(countsByLevel.getOrDefault("INFO", 0L))
                .debugCount(countsByLevel.getOrDefault("DEBUG", 0L))
                .countsByLevel(countsByLevel)
                .build();
    }
}

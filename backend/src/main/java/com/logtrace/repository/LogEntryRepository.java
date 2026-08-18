package com.logtrace.repository;

import com.logtrace.entity.LogEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface LogEntryRepository extends JpaRepository<LogEntry, Long>, JpaSpecificationExecutor<LogEntry> {

    Page<LogEntry> findAll(org.springframework.data.jpa.domain.Specification<LogEntry> spec, Pageable pageable);

    long countByService_IdAndLevel(Long serviceId, com.logtrace.entity.LogLevel level);

    @Query("SELECT le.level as level, COUNT(le) as total FROM LogEntry le " +
            "WHERE (:serviceId IS NULL OR le.service.id = :serviceId) " +
            "AND (:from IS NULL OR le.timestamp >= :from) " +
            "AND (:to IS NULL OR le.timestamp <= :to) " +
            "GROUP BY le.level")
    List<LevelCountProjection> countByLevel(@Param("serviceId") Long serviceId,
                                             @Param("from") LocalDateTime from,
                                             @Param("to") LocalDateTime to);

    long countByService_Id(Long serviceId);

    interface LevelCountProjection {
        com.logtrace.entity.LogLevel getLevel();
        Long getTotal();
    }
}

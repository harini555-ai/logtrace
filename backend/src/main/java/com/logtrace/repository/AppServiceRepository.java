package com.logtrace.repository;

import com.logtrace.entity.AppService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AppServiceRepository extends JpaRepository<AppService, Long> {

    Optional<AppService> findByApiKey(String apiKey);

    boolean existsByServiceName(String serviceName);
}

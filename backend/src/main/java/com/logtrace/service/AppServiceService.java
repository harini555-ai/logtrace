package com.logtrace.service;

import com.logtrace.dto.ServiceCreateRequest;
import com.logtrace.dto.ServiceResponse;
import com.logtrace.entity.AppService;
import com.logtrace.exception.ResourceNotFoundException;
import com.logtrace.repository.AppServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AppServiceService {

    private final AppServiceRepository appServiceRepository;

    @Transactional
    public ServiceResponse registerService(ServiceCreateRequest request) {
        AppService service = AppService.builder()
                .serviceName(request.getServiceName())
                .environment(request.getEnvironment())
                .apiKey(UUID.randomUUID().toString())
                .createdAt(LocalDateTime.now())
                .build();

        AppService saved = appServiceRepository.save(service);
        return ServiceResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<ServiceResponse> getAllServices() {
        return appServiceRepository.findAll()
                .stream()
                .map(ServiceResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public ServiceResponse getServiceById(Long id) {
        AppService service = appServiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));
        return ServiceResponse.fromEntity(service);
    }

    @Transactional
    public ServiceResponse regenerateApiKey(Long id) {
        AppService service = appServiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));
        service.setApiKey(UUID.randomUUID().toString());
        return ServiceResponse.fromEntity(appServiceRepository.save(service));
    }

    @Transactional
    public void deleteService(Long id) {
        if (!appServiceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Service not found with id: " + id);
        }
        appServiceRepository.deleteById(id);
    }
}

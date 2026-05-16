package ru.naumen.experts.user.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.naumen.experts.user.dto.DepartmentListResponse;
import ru.naumen.experts.user.dto.EmployeeResponse;
import ru.naumen.experts.user.dto.OrgStructureResponse;
import ru.naumen.experts.user.dto.PagedEmployeesResponse;
import ru.naumen.experts.user.entity.User;
import ru.naumen.experts.user.mapper.UserMapper;
import ru.naumen.experts.user.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeDirectoryService {

    private final UserRepository userRepository;
    private final OrgStructureService orgStructureService;

    @Transactional(readOnly = true)
    public PagedEmployeesResponse search(String search, String department, String team, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> result = userRepository.searchActiveUsers(
                normalize(search),
                normalize(department),
                normalize(team),
                pageable
        );

        List<EmployeeResponse> content = result.getContent().stream()
                .map(UserMapper::toEmployeeResponse)
                .toList();

        return PagedEmployeesResponse.builder()
                .content(content)
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build();
    }

    @Transactional(readOnly = true)
    public DepartmentListResponse listDepartments() {
        return orgStructureService.listDepartments();
    }

    @Transactional(readOnly = true)
    public OrgStructureResponse getOrgStructure() {
        return orgStructureService.buildForAllUsers();
    }

    private String normalize(String value) {
        return value == null ? null : value.trim();
    }
}

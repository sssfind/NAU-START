package ru.naumen.experts.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.naumen.experts.user.dto.DepartmentListResponse;
import ru.naumen.experts.user.dto.OrgStructureResponse;
import ru.naumen.experts.user.dto.PagedEmployeesResponse;
import ru.naumen.experts.user.service.EmployeeDirectoryService;

@RestController
@RequestMapping("/api/v1/employees")
@RequiredArgsConstructor
@Tag(name = "Employees", description = "Справочник сотрудников")
@SecurityRequirement(name = "bearerAuth")
public class EmployeeController {

    private final EmployeeDirectoryService employeeDirectoryService;

    @Operation(summary = "Справочник сотрудников с поиском и фильтрами")
    @GetMapping
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<PagedEmployeesResponse> search(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String team,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(employeeDirectoryService.search(search, department, team, page, size));
    }

    @Operation(summary = "Список отделов для фильтра")
    @GetMapping("/departments")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<DepartmentListResponse> listDepartments() {
        return ResponseEntity.ok(employeeDirectoryService.listDepartments());
    }

    @Operation(summary = "Оргструктура: отделы и команды")
    @GetMapping("/org-structure")
    @PreAuthorize("hasRole('HR')")
    public ResponseEntity<OrgStructureResponse> getOrgStructure() {
        return ResponseEntity.ok(employeeDirectoryService.getOrgStructure());
    }
}

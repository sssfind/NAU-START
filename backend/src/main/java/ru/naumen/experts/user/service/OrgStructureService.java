package ru.naumen.experts.user.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.naumen.experts.user.dto.DepartmentListResponse;
import ru.naumen.experts.user.dto.OrgStructureResponse;
import ru.naumen.experts.user.repository.UserRepository;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrgStructureService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public DepartmentListResponse listDepartments() {
        return DepartmentListResponse.builder()
                .departments(userRepository.findDistinctDepartments())
                .build();
    }

    @Transactional(readOnly = true)
    public OrgStructureResponse buildForAllUsers() {
        return buildFromRows(userRepository.findDepartmentTeamCounts());
    }

    @Transactional(readOnly = true)
    public OrgStructureResponse buildExcludingUser(Long userId) {
        return buildFromRows(userRepository.findDepartmentTeamCountsExcluding(userId));
    }

    private OrgStructureResponse buildFromRows(List<Object[]> rows) {
        Map<String, List<OrgStructureResponse.TeamNode>> teamsByDepartment = new LinkedHashMap<>();
        Map<String, Integer> departmentCounts = new LinkedHashMap<>();

        for (Object[] row : rows) {
            String department = (String) row[0];
            String team = row[1] != null ? (String) row[1] : "Без команды";
            int count = ((Number) row[2]).intValue();

            departmentCounts.merge(department, count, Integer::sum);
            teamsByDepartment
                    .computeIfAbsent(department, key -> new ArrayList<>())
                    .add(OrgStructureResponse.TeamNode.builder()
                            .name(team)
                            .employeeCount(count)
                            .build());
        }

        List<OrgStructureResponse.DepartmentNode> departments = new ArrayList<>();
        for (Map.Entry<String, List<OrgStructureResponse.TeamNode>> entry : teamsByDepartment.entrySet()) {
            departments.add(OrgStructureResponse.DepartmentNode.builder()
                    .name(entry.getKey())
                    .employeeCount(departmentCounts.getOrDefault(entry.getKey(), 0))
                    .teams(entry.getValue())
                    .build());
        }

        return OrgStructureResponse.builder().departments(departments).build();
    }
}

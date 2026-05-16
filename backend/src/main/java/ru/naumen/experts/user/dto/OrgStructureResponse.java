package ru.naumen.experts.user.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class OrgStructureResponse {

    private List<DepartmentNode> departments;

    @Data
    @Builder
    public static class DepartmentNode {
        private String name;
        private int employeeCount;
        private List<TeamNode> teams;
    }

    @Data
    @Builder
    public static class TeamNode {
        private String name;
        private int employeeCount;
    }
}

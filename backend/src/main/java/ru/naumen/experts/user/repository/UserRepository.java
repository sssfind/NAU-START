package ru.naumen.experts.user.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.naumen.experts.user.entity.User;
import ru.naumen.experts.user.enums.UserRole;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByHrIdAndRoleAndIsActiveTrue(Long hrId, UserRole role);

    List<User> findByRoleAndIsActiveTrue(UserRole role);

    @Query("""
            SELECT u FROM User u
            WHERE u.isActive = true
              AND (:search IS NULL OR :search = ''
                   OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')))
              AND (:department IS NULL OR :department = '' OR u.department = :department)
              AND (:team IS NULL OR :team = '' OR (
                   (:team = 'Без команды' AND (u.team IS NULL OR u.team = ''))
                   OR u.team = :team
              ))
            ORDER BY u.fullName ASC
            """)
    Page<User> searchActiveUsers(
            @Param("search") String search,
            @Param("department") String department,
            @Param("team") String team,
            Pageable pageable);

    @Query("""
            SELECT u FROM User u
            WHERE u.isActive = true
              AND u.id <> :excludeId
              AND (:search IS NULL OR :search = ''
                   OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')))
              AND (:department IS NULL OR :department = '' OR u.department = :department)
              AND (:team IS NULL OR :team = '' OR (
                   (:team = 'Без команды' AND (u.team IS NULL OR u.team = ''))
                   OR u.team = :team
              ))
            ORDER BY
              CASE WHEN :traineeTeam IS NOT NULL AND :traineeTeam <> '' AND u.team = :traineeTeam THEN 0
                   ELSE 1 END,
              u.department ASC,
              u.team ASC,
              u.fullName ASC
            """)
    Page<User> searchActiveUsersForTrainee(
            @Param("excludeId") Long excludeId,
            @Param("traineeTeam") String traineeTeam,
            @Param("search") String search,
            @Param("department") String department,
            @Param("team") String team,
            Pageable pageable);

    @Query("""
            SELECT DISTINCT u.department FROM User u
            WHERE u.isActive = true AND u.department IS NOT NULL AND u.department <> ''
            ORDER BY u.department ASC
            """)
    List<String> findDistinctDepartments();

    @Query("""
            SELECT u.department, u.team, COUNT(u)
            FROM User u
            WHERE u.isActive = true
              AND u.department IS NOT NULL AND u.department <> ''
            GROUP BY u.department, u.team
            ORDER BY u.department ASC, u.team ASC
            """)
    List<Object[]> findDepartmentTeamCounts();

    @Query("""
            SELECT u.department, u.team, COUNT(u)
            FROM User u
            WHERE u.isActive = true
              AND u.id <> :excludeId
              AND u.department IS NOT NULL AND u.department <> ''
            GROUP BY u.department, u.team
            ORDER BY u.department ASC, u.team ASC
            """)
    List<Object[]> findDepartmentTeamCountsExcluding(@Param("excludeId") Long excludeId);
}

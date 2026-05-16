import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { DepartmentList, OrgStructure } from '@/types/employeeDirectory'

export function useHrOrgStructure() {
  return useQuery({
    queryKey: ['employees', 'org-structure'],
    queryFn: async () => {
      const { data } = await api.get<OrgStructure>('/employees/org-structure')
      return data
    },
  })
}

export function useHrDepartments() {
  return useQuery({
    queryKey: ['employees', 'departments'],
    queryFn: async () => {
      const { data } = await api.get<DepartmentList>('/employees/departments')
      return data.departments
    },
  })
}

export function useTraineeOrgStructure() {
  return useQuery({
    queryKey: ['trainee', 'employees', 'org-structure'],
    queryFn: async () => {
      const { data } = await api.get<OrgStructure>('/trainee/employees/org-structure')
      return data
    },
  })
}

export function useTraineeDepartments() {
  return useQuery({
    queryKey: ['trainee', 'employees', 'departments'],
    queryFn: async () => {
      const { data } = await api.get<DepartmentList>('/trainee/employees/departments')
      return data.departments
    },
  })
}

export interface OrgStructure {
  departments: OrgDepartment[]
}

export interface OrgDepartment {
  name: string
  employeeCount: number
  teams: OrgTeam[]
}

export interface OrgTeam {
  name: string
  employeeCount: number
}

export interface DepartmentList {
  departments: string[]
}

export interface DirectoryEmployeeBase {
  userId: number
  email: string
  fullName: string
  role: string
  department: string | null
  phone: string | null
  position: string | null
  team: string | null
  responsibility: string | null
}

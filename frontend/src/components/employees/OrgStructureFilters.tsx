import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { OrgStructure } from '@/types/employeeDirectory'

interface OrgStructureFiltersProps {
  structure: OrgStructure | undefined
  isLoading: boolean
  department: string
  team: string
  onSelectDepartment: (department: string) => void
  onSelectTeam: (department: string, team: string) => void
  onClear: () => void
}

export function OrgStructureFilters({
  structure,
  isLoading,
  department,
  team,
  onSelectDepartment,
  onSelectTeam,
  onClear,
}: OrgStructureFiltersProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-500">
        Загрузка структуры…
      </div>
    )
  }

  if (!structure?.departments.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-500">
        Нет данных по отделам
      </div>
    )
  }

  const hasFilter = Boolean(department || team)

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <p className="text-sm font-semibold text-[#1A1A2E]">Структура компании</p>
        {hasFilter && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-medium text-primary hover:underline"
          >
            Сбросить
          </button>
        )}
      </div>
      <ul className="max-h-[420px] overflow-y-auto p-2">
        {structure.departments.map((dept) => {
          const isDeptOpen = expanded[dept.name] ?? department === dept.name
          const isDeptActive = department === dept.name && !team

          return (
            <li key={dept.name} className="mb-1">
              <button
                type="button"
                onClick={() => {
                  setExpanded((prev) => ({ ...prev, [dept.name]: !isDeptOpen }))
                  onSelectDepartment(dept.name)
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors',
                  isDeptActive ? 'bg-orange-50 text-primary' : 'hover:bg-gray-50 text-gray-700'
                )}
              >
                {isDeptOpen ? (
                  <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
                )}
                <span className="flex-1 font-medium">{dept.name}</span>
                <span className="text-xs text-gray-400">{dept.employeeCount}</span>
              </button>
              {isDeptOpen && (
                <ul className="ml-6 mt-0.5 space-y-0.5 border-l border-gray-100 pl-2">
                  {dept.teams.map((t) => {
                    const isTeamActive = department === dept.name && team === t.name
                    return (
                      <li key={`${dept.name}-${t.name}`}>
                        <button
                          type="button"
                          onClick={() => onSelectTeam(dept.name, t.name)}
                          className={cn(
                            'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs transition-colors',
                            isTeamActive
                              ? 'bg-orange-50 font-medium text-primary'
                              : 'text-gray-600 hover:bg-gray-50'
                          )}
                        >
                          <span>{t.name}</span>
                          <span className="text-gray-400">{t.employeeCount}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

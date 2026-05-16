import { useState } from 'react'
import { CheckCircle2, UserPlus } from 'lucide-react'
import { EmployeeDetailDialog } from '@/components/employees/EmployeeDetailDialog'
import { OrgStructureFilters } from '@/components/employees/OrgStructureFilters'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEmployees } from '@/hooks/useEmployees'
import { useHrDepartments, useHrOrgStructure } from '@/hooks/useEmployeeDirectory'
import { useAssignTrainee } from '@/hooks/useTrainees'
import { roleLabels } from '@/lib/roleLabels'
import type { Employee } from '@/types/user'

export function EmployeesPage() {
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('')
  const [team, setTeam] = useState('')
  const [page, setPage] = useState(0)
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selected, setSelected] = useState<Employee | null>(null)
  const storedUser = localStorage.getItem('user')
  const currentHrId = storedUser ? Number(JSON.parse(storedUser).userId) : null

  const { data: orgStructure, isLoading: orgLoading } = useHrOrgStructure()
  const { data: departments = [] } = useHrDepartments()
  const { data, isLoading, refetch } = useEmployees(debouncedSearch, department, team, page)
  const assign = useAssignTrainee()

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    setDebouncedSearch(search.trim())
    setPage(0)
    void refetch()
  }

  function applyDepartment(dept: string) {
    setDepartment(dept)
    setTeam('')
    setPage(0)
  }

  function applyTeam(dept: string, teamName: string) {
    setDepartment(dept)
    setTeam(teamName)
    setPage(0)
  }

  function clearStructureFilter() {
    setDepartment('')
    setTeam('')
    setPage(0)
  }

  const rows = data?.content ?? []

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1A1A2E]">Справочник сотрудников</h1>
      <p className="mt-1 text-sm text-gray-500">
        Оргструктура, контакты, зоны ответственности и назначение стажёров
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        <OrgStructureFilters
          structure={orgStructure}
          isLoading={orgLoading}
          department={department}
          team={team}
          onSelectDepartment={applyDepartment}
          onSelectTeam={applyTeam}
          onClear={clearStructureFilter}
        />

        <div className="min-w-0 space-y-4">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-wrap gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <Input
              placeholder="Поиск по имени или email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-[200px] flex-1"
            />
            <Select
              value={department || '__all__'}
              onValueChange={(value) => {
                setDepartment(value === '__all__' ? '' : value)
                setTeam('')
                setPage(0)
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Все отделы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Все отделы</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit">Найти</Button>
          </form>

          {(department || team) && (
            <p className="text-sm text-gray-600">
              Фильтр: {department}
              {team ? ` → ${team}` : ''}
            </p>
          )}

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {isLoading && (
              <p className="px-6 py-8 text-center text-gray-500">Загрузка…</p>
            )}
            {!isLoading && rows.length === 0 && (
              <p className="px-6 py-8 text-center text-gray-500">Сотрудники не найдены</p>
            )}
            {!isLoading && rows.length > 0 && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] text-left text-sm">
                    <thead className="border-b border-gray-100 bg-gray-50/80">
                      <tr>
                        <th className="px-4 py-3 font-medium text-gray-600">ФИО</th>
                        <th className="px-4 py-3 font-medium text-gray-600">Должность</th>
                        <th className="px-4 py-3 font-medium text-gray-600">Отдел</th>
                        <th className="px-4 py-3 font-medium text-gray-600">Команда</th>
                        <th className="px-4 py-3 font-medium text-gray-600">Телефон</th>
                        <th className="px-4 py-3 font-medium text-gray-600">Роль</th>
                        <th className="px-4 py-3 font-medium text-gray-600" />
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((emp) => (
                        <tr
                          key={emp.userId}
                          className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80"
                        >
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => setSelected(emp)}
                              className="font-medium text-[#1A1A2E] hover:text-primary hover:underline"
                            >
                              {emp.fullName}
                            </button>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{emp.position ?? '—'}</td>
                          <td className="px-4 py-3 text-gray-600">{emp.department ?? '—'}</td>
                          <td className="px-4 py-3 text-gray-600">{emp.team ?? '—'}</td>
                          <td className="px-4 py-3 text-gray-600">{emp.phone ?? '—'}</td>
                          <td className="px-4 py-3 text-gray-600">
                            {roleLabels[emp.role] ?? emp.role}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {emp.role !== 'ROLE_HR' && emp.hrId === currentHrId && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-primary">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Мой стажёр
                              </span>
                            )}
                            {emp.role !== 'ROLE_HR' && !emp.hrId && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1"
                                onClick={() => assign.mutate(emp.userId)}
                                disabled={assign.isPending}
                              >
                                <UserPlus className="h-3.5 w-3.5" />
                                Добавить стажёра
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {data && data.totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 0}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      Назад
                    </Button>
                    <span className="text-sm text-gray-500">
                      Страница {page + 1} из {data.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= data.totalPages - 1}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Вперёд
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <EmployeeDetailDialog
        employee={selected}
        open={selected != null}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </div>
  )
}

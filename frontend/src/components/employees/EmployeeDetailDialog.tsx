import { Building2, Briefcase, Mail, Phone, Users } from 'lucide-react'
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { roleLabels } from '@/lib/roleLabels'
import type { DirectoryEmployeeBase } from '@/types/employeeDirectory'

interface EmployeeDetailDialogProps {
  employee: DirectoryEmployeeBase | null
  open: boolean
  onOpenChange: (open: boolean) => void
  extra?: React.ReactNode
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail
  label: string
  value: string
}) {
  return (
    <div className="flex gap-3 text-sm">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
      <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-[#1A1A2E]">{value}</p>
      </div>
    </div>
  )
}

export function EmployeeDetailDialog({
  employee,
  open,
  onOpenChange,
  extra,
}: EmployeeDetailDialogProps) {
  if (!employee) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>{employee.fullName}</DialogTitle>
          <DialogDescription>
            {roleLabels[employee.role] ?? employee.role}
            {employee.position ? ` · ${employee.position}` : ''}
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <DetailRow icon={Mail} label="Email" value={employee.email} />
          {employee.phone && <DetailRow icon={Phone} label="Телефон" value={employee.phone} />}
          {employee.department && (
            <DetailRow icon={Building2} label="Отдел" value={employee.department} />
          )}
          {employee.team && <DetailRow icon={Users} label="Команда" value={employee.team} />}
          {employee.position && (
            <DetailRow icon={Briefcase} label="Должность" value={employee.position} />
          )}
          {employee.responsibility && (
            <div className="rounded-xl bg-gray-50 p-4 text-sm">
              <p className="text-xs font-medium text-gray-500">Зона ответственности</p>
              <p className="mt-1 leading-relaxed text-[#1A1A2E]">{employee.responsibility}</p>
            </div>
          )}
          {extra}
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}

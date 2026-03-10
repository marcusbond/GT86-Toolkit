interface StatusBadgeProps {
  status: 'pass' | 'warn' | 'fail'
  label: string
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const styles = {
    pass: 'bg-green-50 text-green-600',
    warn: 'bg-amber-50 text-amber-600',
    fail: 'bg-red-50 text-red-600',
  }

  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${styles[status]}`}>
      {label}
    </span>
  )
}

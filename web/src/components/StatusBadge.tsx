interface StatusBadgeProps {
  status: 'pass' | 'warn' | 'fail'
  label: string
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const styles = {
    pass: 'bg-pass-bg text-pass',
    warn: 'bg-warn-bg text-warn',
    fail: 'bg-fail-bg text-fail',
  }

  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-[3px] ${styles[status]}`}>
      {label}
    </span>
  )
}

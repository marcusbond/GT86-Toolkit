import type { ReactNode } from 'react'

interface CardProps {
  title: string
  badge?: ReactNode
  children: ReactNode
}

export function Card({ title, badge, children }: CardProps) {
  return (
    <div className="bg-surface border border-border rounded mb-3 overflow-hidden">
      <div className="flex items-center justify-between px-[18px] py-4">
        <span className="text-[14px] font-semibold">{title}</span>
        {badge}
      </div>
      {children}
    </div>
  )
}

export function CardBody({ children }: { children: ReactNode }) {
  return (
    <div className="px-[18px] pb-[18px] text-[14px] text-text-mid leading-relaxed">
      {children}
    </div>
  )
}

export function ContextBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-3 py-3.5 px-4 bg-bg border-l-2 border-accent text-[13px] leading-relaxed text-text-mid">
      <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-accent mb-1">
        {label}
      </div>
      {children}
    </div>
  )
}

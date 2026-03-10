import type { ReactNode } from 'react'

interface CardProps {
  title: string
  badge?: ReactNode
  children: ReactNode
}

export function Card({ title, badge, children }: CardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded mb-3 overflow-hidden">
      <div className="flex items-center justify-between px-4.5 py-4">
        <span className="text-sm font-semibold">{title}</span>
        {badge}
      </div>
      {children}
    </div>
  )
}

export function CardBody({ children }: { children: ReactNode }) {
  return <div className="px-4.5 pb-4.5 text-sm text-gray-500 leading-relaxed">{children}</div>
}

export function ContextBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-3 p-3.5 bg-gray-50 border-l-2 border-blue-600 text-[13px] leading-relaxed text-gray-500">
      <div className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-1">
        {label}
      </div>
      {children}
    </div>
  )
}

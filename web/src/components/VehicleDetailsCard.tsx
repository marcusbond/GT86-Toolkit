import type { VehicleDetails } from '@/dvla'
import { Card } from './Card'

interface VehicleDetailsCardProps {
  vehicle: VehicleDetails
}

function statusClass(text: string): string {
  if (text.startsWith('Taxed')) return 'text-pass'
  if (text === 'SORN') return 'text-fail'
  return ''
}

export function VehicleDetailsCard({ vehicle }: VehicleDetailsCardProps) {
  const rows: { label: string; value: string; className?: string }[] = [
    { label: 'First registered', value: vehicle.registrationDate },
    { label: 'Colour', value: vehicle.colour },
    { label: 'Engine', value: vehicle.engine },
    { label: 'Tax status', value: vehicle.taxStatus, className: statusClass(vehicle.taxStatus) },
  ]

  if (vehicle.motExpiry) {
    rows.push({
      label: 'MOT expires',
      value: vehicle.motExpiry,
      className: 'text-pass',
    })
  }

  return (
    <Card title="Vehicle Details">
      <div className="border-t border-border">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex justify-between items-center px-[18px] py-[11px] text-[13px] border-b border-border last:border-b-0"
          >
            <span className="text-text-mid">{row.label}</span>
            <span className={`font-semibold ${row.className ?? ''}`}>{row.value}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

import type { ScanProgress } from '@/scan'

interface ScanScreenProps {
  progress: ScanProgress
}

export function ScanScreen({ progress }: ScanScreenProps) {
  return (
    <div>
      <div className="text-[12px] font-bold uppercase tracking-[0.1em] text-accent mb-4">
        GT86 Toolkit
      </div>

      <div className="text-center mt-[100px]">
        <h2 className="text-[18px] font-semibold mb-1.5">Scanning</h2>
        <p className="text-[14px] text-text-mid">{progress.step}</p>
        <div className="w-[200px] h-[3px] bg-border rounded mx-auto mt-7 overflow-hidden">
          <div
            className="h-full bg-text rounded transition-[width] duration-400 ease-in-out"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </div>
    </div>
  )
}

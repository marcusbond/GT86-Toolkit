interface ConnectScreenProps {
  onConnect: () => void
}

export function ConnectScreen({ onConnect }: ConnectScreenProps) {
  return (
    <div>
      <div className="text-[12px] font-bold uppercase tracking-[0.1em] text-accent mb-4">
        GT86 Toolkit
      </div>

      <h1 className="text-[26px] font-bold tracking-[-0.03em] leading-[1.15] mb-2">
        Pre-purchase
        <br />
        health check
      </h1>

      <p className="text-[15px] text-text-mid mb-8">
        Check a GT86 before you buy it. Takes about 30 seconds.
      </p>

      <div className="bg-surface border border-border rounded px-5 py-5 mb-5">
        <div className="flex gap-3.5 items-start">
          <span className="w-[22px] h-[22px] rounded bg-text text-white text-[11px] font-bold flex items-center justify-center shrink-0">
            1
          </span>
          <span className="text-[14px] text-text-mid pt-px">
            Plug the OBD2 adapter into the port under the dashboard (driver's side)
          </span>
        </div>
        <div className="flex gap-3.5 items-start mt-3.5 pt-3.5 border-t border-border">
          <span className="w-[22px] h-[22px] rounded bg-text text-white text-[11px] font-bold flex items-center justify-center shrink-0">
            2
          </span>
          <span className="text-[14px] text-text-mid pt-px">
            Turn ignition to ON — don't start the engine
          </span>
        </div>
      </div>

      <button
        onClick={() => onConnect()}
        className="block w-full py-3.5 text-[14px] font-semibold bg-text text-white border-none rounded cursor-pointer transition-colors hover:bg-[#333] font-sans"
      >
        Connect and scan
      </button>
    </div>
  )
}

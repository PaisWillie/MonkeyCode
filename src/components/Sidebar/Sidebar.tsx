import clsx from 'clsx'

type SidebarProps = {
  cpm: string
  accuracy: string
  rawCpm: string
  rawAccuracy: string
  time: string
}

const Sidebar = ({
  cpm,
  accuracy,
  rawCpm,
  rawAccuracy,
  time
}: SidebarProps) => {
  const isValid = accuracy && parseFloat(accuracy) >= 70

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-col">
        <span>cpm</span>
        <span
          className={clsx([metricStyle, cpm ? 'text-white' : 'text-slate-500'])}
        >
          {accuracy === '' ? 'null' : isValid ? cpm || 'null' : 'invalid'}
        </span>
      </div>
      <div className="flex flex-col">
        <span>raw cpm</span>
        <span
          className={clsx([metricStyle, cpm ? 'text-white' : 'text-slate-500'])}
        >
          {accuracy === '' ? 'null' : isValid ? rawCpm || 'null' : 'invalid'}
        </span>
      </div>
      <div className="flex flex-col">
        <span>accuracy</span>
        <span
          className={clsx([
            metricStyle,
            accuracy ? 'text-white' : 'text-slate-500'
          ])}
        >
          {accuracy || 'null'}
        </span>
      </div>
      <div className="flex flex-col">
        <span>raw accuracy</span>
        <span
          className={clsx([
            metricStyle,
            rawAccuracy ? 'text-white' : 'text-slate-500'
          ])}
        >
          {rawAccuracy || 'null'}
        </span>
      </div>
      <div className="flex flex-col">
        <span>time</span>
        <span
          className={clsx([
            metricStyle,
            time ? 'text-white' : 'text-slate-500'
          ])}
        >
          {time || 'null'}
        </span>
      </div>
    </div>
  )
}

const metricStyle = 'text-xl'

export default Sidebar

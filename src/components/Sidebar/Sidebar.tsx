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
  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-col">
        <span>cpm</span>
        <span
          className={clsx([metricStyle, cpm ? 'text-white' : 'text-slate-500'])}
        >
          {cpm || 'null'}
        </span>
      </div>
      <div className="flex flex-col">
        <span>raw cpm</span>
        <span
          className={clsx([metricStyle, cpm ? 'text-white' : 'text-slate-500'])}
        >
          {rawCpm || 'null'}
        </span>
      </div>
      <div className="flex flex-col">
        <span>accuracy</span>
        <span
          className={clsx([metricStyle, cpm ? 'text-white' : 'text-slate-500'])}
        >
          {accuracy || 'null'}
        </span>
      </div>
      <div className="flex flex-col">
        <span>raw accuracy</span>
        <span
          className={clsx([metricStyle, cpm ? 'text-white' : 'text-slate-500'])}
        >
          {rawAccuracy || 'null'}
        </span>
      </div>
      <div className="flex flex-col">
        <span>time</span>
        <span
          className={clsx([metricStyle, cpm ? 'text-white' : 'text-slate-500'])}
        >
          {time ? time + 's' : 'null'}
        </span>
      </div>
    </div>
  )
}

const metricStyle = 'text-xl'

export default Sidebar

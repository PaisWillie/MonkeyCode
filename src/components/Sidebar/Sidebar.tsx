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
    <div className="flex flex-col">
      <div className="flex flex-col">
        <span>cpm</span>
        <span className={clsx([cpm ? 'text-white' : 'text-slate-400'])}>
          {cpm || 'TBD'}
        </span>
      </div>
      <div className="flex flex-col">
        <span>raw cpm</span>
        <span className={clsx([cpm ? 'text-white' : 'text-slate-400'])}>
          {rawCpm || 'TBD'}
        </span>
      </div>
      <div className="flex flex-col">
        <span>accuracy</span>
        <span className={clsx([cpm ? 'text-white' : 'text-slate-400'])}>
          {accuracy || 'TBD'}
        </span>
      </div>
      <div className="flex flex-col">
        <span>raw accuracy</span>
        <span className={clsx([cpm ? 'text-white' : 'text-slate-400'])}>
          {rawAccuracy || 'TBD'}
        </span>
      </div>
      <div className="flex flex-col">
        <span>time</span>
        <span className={clsx([cpm ? 'text-white' : 'text-slate-400'])}>
          {time || 'TBD'}s
        </span>
      </div>
    </div>
  )
}

export default Sidebar

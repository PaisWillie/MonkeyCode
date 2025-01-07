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
        <span className="text-white">{cpm}</span>
      </div>
      <div className="flex flex-col">
        <span>raw cpm</span>
        <span className="text-white">{rawCpm}</span>
      </div>
      <div className="flex flex-col">
        <span>accuracy</span>
        <span className="text-white">{accuracy}</span>
      </div>
      <div className="flex flex-col">
        <span>raw accuracy</span>
        <span className="text-white">{rawAccuracy}</span>
      </div>
      <div className="flex flex-col">
        <span>time</span>
        <span className="text-white">{time}</span>
      </div>
    </div>
  )
}

export default Sidebar

import { Button, Progress } from 'antd'
import { useEffect, useState } from 'react'

type ProgressBarProps = {
  setLoadingBarPercent: (percent: number) => void
}

const ProgressBar = ({ setLoadingBarPercent }: ProgressBarProps) => {
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    const duration = 5000 // Total duration (5 seconds)

    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime
      const progress = Math.min(elapsedTime / duration, 1) // Clamped between 0 and 1

      // Exponential easing-out formula
      const easedValue = Math.floor(100 * (1 - Math.pow(2, -10 * progress)))

      setPercent(easedValue)
      setLoadingBarPercent(easedValue)

      if (progress >= 1) {
        clearInterval(interval) // Stop when progress reaches 100%
      }
    }, 16) // ~60fps for smooth animation

    return () => clearInterval(interval)
  }, [setLoadingBarPercent])

  return (
    <div className="mx-48 mt-48 flex flex-1 flex-col items-center">
      <p className="text-white">
        {percent < 98
          ? 'Requesting snippet from ChatGPT...'
          : 'Preparing snippet for you...'}
      </p>
      <Progress
        percent={percent}
        status="active"
        strokeColor={{ from: '#108ee9', to: '#87d068' }}
      />
      <Button
        type="primary"
        onClick={() => {
          setPercent(0)
        }}
      >
        Reset
      </Button>
    </div>
  )
}

export default ProgressBar

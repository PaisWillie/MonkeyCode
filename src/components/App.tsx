import { useEffect, useRef, useState } from 'react'
import Snippet from './Snippet'

const testSnippet = `def two_sum(nums, target):
    num_map = {}

    for i, num in enumerate(nums):
        complement = target - num

        if complement in num_map:
            return [num_map[complement], i]

        num_map[num] = i

    return []`

export type InputEntry = {
  lineIndex: number
  wordIndex: number
  actualChars: string[]
  typedChars: string[]
}

function App() {
  const [snippet, setSnippet] = useState<string>(testSnippet)

  const inputRef = useRef<HTMLInputElement>(null)

  const [isFocused, setIsFocused] = useState<boolean>(false)

  const [currLine, setCurrLine] = useState<number>(0)
  const [currWord, setCurrWord] = useState<number>(0)
  const [currChar, setCurrChar] = useState<number>(0)

  const [numSpaceEnterInputs, setNumSpaceEnterInputs] = useState<number>(0)

  const [input, setInput] = useState<InputEntry[]>([])

  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)

  useEffect(() => {
    const initializeInput = () => {
      const lines = snippet.split('\n')
      const initialInput = lines
        .flatMap((line, lineIndex) =>
          line.split(' ').map((_, wordIndex) => ({
            lineIndex,
            wordIndex,
            actualChars: line.split(' ')[wordIndex].split(''),
            typedChars: []
          }))
        )
        .filter((entry) => entry.actualChars.length > 0)
      setInput(initialInput)
    }
    initializeInput()
  }, [snippet])

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-between bg-[#323437] font-['Space_Mono'] text-[#646669]">
      <header></header>
      <main>
        <Snippet
          snippet={snippet}
          input={input}
          setInput={setInput}
          currLine={currLine}
          currWord={currWord}
          currChar={currChar}
          setCurrLine={setCurrLine}
          setCurrWord={setCurrWord}
          setCurrChar={setCurrChar}
          numSpaceEnterInputs={numSpaceEnterInputs}
          setNumSpaceEnterInputs={setNumSpaceEnterInputs}
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
          isFocused={isFocused}
          setIsFocused={setIsFocused}
          inputRef={inputRef}
        />
      </main>
      <footer></footer>
    </div>
  )
}

export default App

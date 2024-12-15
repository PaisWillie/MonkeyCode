import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Snippet from './Snippet'
import { Button } from 'antd'

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

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY

const openai = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
})

const getOpenAIResponse = async (prompt: string) => {
  const response = await openai.post('/chat/completions', {
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          "Generate code snippet based on user prompt. Don't include other info other than code snippet (no code comments)."
      },
      { role: 'user', content: prompt }
    ]
  })

  // Remove any lines that contain "```" (start and end of code block)
  response.data.choices[0].message.content =
    response.data.choices[0].message.content
      .split('\n')
      .filter((line: string) => !line.includes('```'))
      .join('\n')

  return response.data
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
        <div className="flex flex-row">
          <p className="text-slate-200">
            I want to type [Leetcode] with [Python] about [any topic] on
            [medium] difficulty
          </p>
          <Button
            onClick={async () => {
              const response = await getOpenAIResponse(
                'Leetcode Java medium sliding window problem'
              )
              setSnippet(response.choices[0].message.content)
              console.log(response)
            }}
          >
            Generate
          </Button>
          {/* <p>
            I want to type [Leetcode] with [C++] about [problem #] on
            [medium] difficulty
          </p> */}
          {/* <p>I want to type [React] with [TypeScript]</p>
          <p>I want to type [Swift] with [UIKit]</p> */}
        </div>
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

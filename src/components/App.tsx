import { ConfigProvider, theme } from 'antd'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import background from '../assets/background.jpg'
import ProgressBar from './ProgressBar/ProgressBar'
import PromptSelection from './Prompt/PromptSelection'
import Sidebar from './Sidebar/Sidebar'
import Snippet from './Snippet'

const testSnippet = `def func():
    print("Hello, World!")`

export type InputEntry = {
  lineIndex: number
  wordIndex: number
  actualChars: string[]
  typedChars: string[]
}

export const isMatchingChars = (input: InputEntry) =>
  input.typedChars.length === input.actualChars.length &&
  input.typedChars.every(
    (typedChar, typedCharIndex) =>
      typedChar === input.actualChars[typedCharIndex]
  )

const getNumCorrectChars = (
  input: InputEntry[],
  includeIncompleteWords?: boolean
) =>
  input
    .filter((entry) => {
      return includeIncompleteWords || isMatchingChars(entry)
    })
    .reduce((acc, entry) => {
      return acc + getNumCorrectCharsSingleWord(entry)
    }, 0)

const getNumCorrectCharsSingleWord = (input: InputEntry) =>
  input.typedChars.filter((char, charIndex) => {
    return char === input.actualChars[charIndex]
  }).length

// Number of extra characters typed (past the length of the actual characters)
// Extra characters are counted only if the word is correct
// Extra characters are capped at the number of correct characters in the word for accuracy calculation
const getNumExtraChars = (input: InputEntry[]) =>
  input.reduce((acc, entry) => {
    return (
      acc +
      Math.min(
        Math.max(entry.typedChars.length - entry.actualChars.length, 0),
        getNumCorrectCharsSingleWord(entry)
      )
    )
  }, 0)

// Number of total characters needed to type
const getTotalChars = (input: InputEntry[]) =>
  input.reduce((acc, entry) => acc + entry.actualChars.length, 0)

// Accuracy = (Number of correct characters) / (Total number of characters)
const getAccuracy = (input: InputEntry[]) => {
  const totalChars = getTotalChars(input)
  return totalChars ? getNumCorrectChars(input) / totalChars : 0
}

// Raw accuracy = (Number of correct characters - Number of extra characters) / (Total number of characters)
const getRawAccuracy = (input: InputEntry[]) => {
  const totalChars = getTotalChars(input)
  return totalChars
    ? (getNumCorrectChars(input, true) - getNumExtraChars(input)) / totalChars
    : 0
}

// Characters per minute = (Number of correct characters + Number of space/enter inputs) / (Time taken in minutes)
const getCPM = (
  input: InputEntry[],
  startTime: number,
  endTime: number,
  numSpaceEnterInputs: number
) =>
  (
    (getNumCorrectChars(input) + numSpaceEnterInputs) /
    ((endTime - startTime) / 1000 / 60)
  ).toFixed(0)

// Raw characters per minute = (Number of correct characters + Number of space/enter inputs) / (Time taken in minutes)
const getRawCPM = (
  input: InputEntry[],
  startTime: number,
  endTime: number,
  numSpaceEnterInputs: number
) =>
  (
    (getNumCorrectChars(input, true) +
      numSpaceEnterInputs -
      getNumExtraChars(input)) /
    ((endTime - startTime) / 1000 / 60)
  ).toFixed(0)

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

  const [selectedPrompt, setSelectedPrompt] = useState<string>(
    'LeetCode Python Arrays Easy'
  )

  const [cpm, setCpm] = useState<string>('')
  const [rawCpm, setRawCpm] = useState<string>('')
  const [rawAccuracy, setRawAccuracy] = useState<string>('')
  const [accuracy, setAccuracy] = useState<string>('')
  const [time, setTime] = useState<string>('')

  const [showLoadingBar, setShowLoadingBar] = useState<boolean>(false)
  const [loadingBarPercent, setLoadingBarPercent] = useState<number>(0)
  const [isGPTReady, setIsGPTReady] = useState<boolean>(false)

  useEffect(() => {
    // Is Finished
    if (startTime !== null && endTime !== null) {
      setAccuracy(`${(getAccuracy(input) * 100).toFixed(0)}%`)
      setRawCpm(getRawCPM(input, startTime, endTime, numSpaceEnterInputs))
      setRawAccuracy(`${(getRawAccuracy(input) * 100).toFixed(0)}%`)
      setTime(((endTime - startTime) / 1000).toFixed(2))
      setCpm(getCPM(input, startTime, endTime, numSpaceEnterInputs))
    }
  }, [startTime, endTime, input, numSpaceEnterInputs])

  const getNumLines = (snippet: string) => snippet.split('\n').length

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

  useEffect(() => {
    if (isGPTReady && loadingBarPercent >= 99) {
      showLoadingBar && setShowLoadingBar(false)
    }
  }, [
    isGPTReady,
    loadingBarPercent,
    showLoadingBar,
    setShowLoadingBar,
    setIsGPTReady
  ])

  const resetCounter = () => {
    setCurrLine(0)
    setCurrWord(0)
    setCurrChar(0)
    setNumSpaceEnterInputs(0)
    setStartTime(null)
    setEndTime(null)
    setCpm('')
    setRawCpm('')
    setRawAccuracy('')
    setAccuracy('')
    setTime('')
  }

  return (
    <ConfigProvider
      theme={{
        // 1. Use dark algorithm
        algorithm: theme.darkAlgorithm,
        components: {
          Tree: {
            colorBgContainer: 'transparent',
            directoryNodeSelectedBg: 'transparent',
            nodeHoverBg: 'transparent',
            nodeSelectedBg: 'transparent',
            colorBgTextHover: 'transparent'
          }
        }
      }}
    >
      <div
        className="flex h-screen w-screen flex-col items-center justify-between bg-cover bg-center font-['Space_Mono'] text-[#646669]"
        style={{
          backgroundImage: `url(${background})`
        }}
      >
        <div className="grid size-full grid-rows-12 bg-black/15 p-8 backdrop-blur-2xl">
          <header
            className={clsx([
              containerStyle,
              'flex flex-row items-center justify-center px-4 py-2'
            ])}
          >
            <PromptSelection
              resetCounter={resetCounter}
              setSnippet={setSnippet}
              setSelectedPrompt={setSelectedPrompt}
              setIsGPTReady={setIsGPTReady}
              setShowLoadingBar={setShowLoadingBar}
            />
          </header>
          <main className="row-span-11 grid grid-rows-12">
            <div className="flex flex-row items-center text-sm">
              {selectedPrompt &&
                selectedPrompt.split(' ').map((word, index) => {
                  if (index === 0) {
                    return word
                  }

                  return ` > ${word}`
                })}
            </div>
            <div className="row-span-11 grid h-full grid-cols-5 gap-8">
              <nav id="sidebar" className={clsx([containerStyle, 'px-4 py-2'])}>
                {/* <Sidebar expandedKeys={expandedKeys} /> */}
                <Sidebar
                  cpm={cpm}
                  accuracy={accuracy}
                  rawCpm={rawCpm}
                  rawAccuracy={rawAccuracy}
                  time={time}
                />
              </nav>
              <div className="col-span-4 h-full gap-6">
                <div
                  id="code"
                  className={clsx([
                    containerStyle,
                    'flex h-full flex-row gap-x-4 p-2'
                  ])}
                >
                  {!showLoadingBar && (
                    <>
                      <pre className="rounded-md bg-blue-400/10 px-2 py-1 text-right">
                        {Array.from(
                          { length: getNumLines(snippet) },
                          (_, i) => i + 1
                        )
                          .map((num) => num.toString())
                          .join('\n')}
                      </pre>
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
                        setNumSpaceEnterInputs={setNumSpaceEnterInputs}
                        startTime={startTime}
                        setStartTime={setStartTime}
                        endTime={endTime}
                        setEndTime={setEndTime}
                        isFocused={isFocused}
                        setIsFocused={setIsFocused}
                        inputRef={inputRef}
                      />
                    </>
                  )}
                  {showLoadingBar && (
                    <ProgressBar setLoadingBarPercent={setLoadingBarPercent} />
                  )}
                </div>
                {/* <div
                  id="console"
                  className={clsx([containerStyle, 'px-4 py-2'])}
                >
                  Console
                </div> */}
              </div>
            </div>
          </main>
          {/* <footer></footer> */}
        </div>
      </div>
    </ConfigProvider>
  )
}

const containerStyle = 'rounded-lg bg-slate-800/50'

export default App

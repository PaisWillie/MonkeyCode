import { useRef, useState, useEffect } from 'react'

const snippet = `def threeSum(nums):
    nums.sort()
    result = []

    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue

        left, right = i + 1, len(nums) - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total == 0:
                result.append([nums[i], nums[left], nums[right]])
                left += 1
                right -= 1

                while left < right and nums[left] == nums[left - 1]:
                    left += 1
                while left < right and nums[right] == nums[right + 1]:
                    right -= 1
            elif total < 0:
                left += 1
            else:
                right -= 1

    return result
`

function App() {
  const inputRef = useRef<HTMLInputElement>(null)

  const [currLine, setCurrLine] = useState<number>(0)
  const [currWord, setCurrWord] = useState<number>(0)
  const [currChar, setCurrChar] = useState<number>(0)
  const [input, setInput] = useState<
    { lineIndex: number; wordIndex: number; typedChars: string[] }[]
  >([])

  useEffect(() => {
    const initializeInput = () => {
      const lines = snippet.split('\n')
      const initialInput = lines.flatMap((line, lineIndex) =>
        line.split(' ').map((_, wordIndex) => ({
          lineIndex,
          wordIndex,
          typedChars: []
        }))
      )
      setInput(initialInput)
    }
    initializeInput()
  }, [])

  const handlePreClick = () => {
    inputRef.current?.focus()
  }

  const handleEnterKey = (wordsInLine: string[], lines: string[]) => {
    if (currWord !== wordsInLine.length - 1 || currChar === 0) {
      return
    }

    // Move to next non-blank line
    let nextLineIndex = currLine + 1
    while (nextLineIndex < lines.length && lines[nextLineIndex].trim() === '') {
      nextLineIndex++
    }
    if (nextLineIndex < lines.length) {
      setCurrLine(nextLineIndex)
      setCurrWord(0)
      setCurrChar(0)
      const nextLine = lines[nextLineIndex]
      const firstNonBlankWordIndex = nextLine
        .split(' ')
        .findIndex((word) => word.trim() !== '')
      setCurrWord(firstNonBlankWordIndex !== -1 ? firstNonBlankWordIndex : 0)
    }
  }

  const handleSpaceKey = (wordsInLine: string[]) => {
    if (currChar === 0 || currWord === wordsInLine.length - 1) {
      return
    }

    // Move to next word
    setCurrWord((prev) => prev + 1)
    setCurrChar(0)
  }

  const handleBackspaceKey = (wordsInLine: string[]) => {
    const firstNonBlankWordIndex = wordsInLine.findIndex(
      (word) => word.trim() !== ''
    )
    if (currChar === 0 && currWord > firstNonBlankWordIndex) {
      // Move to previous word
      setCurrWord((prev) => prev - 1)
      const previousWordEntry = input.find(
        (entry) =>
          entry.lineIndex === currLine && entry.wordIndex === currWord - 1
      )
      setCurrChar(previousWordEntry ? previousWordEntry.typedChars.length : 0)
    } else {
      // Move to previous character
      setCurrChar((prev) => (prev ? prev - 1 : 0))
    }
    setInput((prevInput) => {
      const newInput = [...prevInput]
      const existingEntryIndex = newInput.findIndex(
        (entry) => entry.lineIndex === currLine && entry.wordIndex === currWord
      )
      if (
        existingEntryIndex !== -1 &&
        newInput[existingEntryIndex].typedChars.length > 0
      ) {
        newInput[existingEntryIndex].typedChars.pop()
      }
      return newInput
    })
  }

  const handleAlphanumericKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to next character
    setCurrChar((prev) => prev + 1)
    setInput((prevInput) => {
      const newInput = [...prevInput]
      const existingEntryIndex = newInput.findIndex(
        (entry) => entry.lineIndex === currLine && entry.wordIndex === currWord
      )
      if (existingEntryIndex !== -1) {
        newInput[existingEntryIndex].typedChars.push(e.key)
      }
      return newInput
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const wordsInLine = snippet.split('\n')[currLine].split(' ')
    const lines = snippet.split('\n')

    if (e.key === 'Enter') {
      handleEnterKey(wordsInLine, lines)
    } else if (e.key === ' ') {
      handleSpaceKey(wordsInLine)
    } else if (e.key === 'Backspace') {
      handleBackspaceKey(wordsInLine)
    } else if (e.key.length === 1) {
      handleAlphanumericKey(e)
    }
  }

  const renderSnippet = (snippet: string) => {
    return snippet.split('\n').map((line, lineIndex) => (
      <div key={lineIndex}>
        {line.split(' ').map((word, wordIndex) => (
          <span key={`${lineIndex}-${wordIndex}`}>
            {word.split('').map((char, charIndex) =>
              charIndex === currChar &&
              wordIndex === currWord &&
              lineIndex === currLine ? (
                <span key={`${lineIndex}-${wordIndex}-${charIndex}`}>
                  <span className="absolute -translate-x-1 animate-blink text-white">
                    |
                  </span>
                  {char}
                </span>
              ) : (
                <span key={`${lineIndex}-${wordIndex}-${charIndex}`}>
                  {char}
                </span>
              )
            )}
            {/* Display extra characters typed */}
            {input.find(
              (entry) =>
                entry.lineIndex === lineIndex && entry.wordIndex === wordIndex
            )?.typedChars.length || 0 > word.length
              ? input
                  .find(
                    (entry) =>
                      entry.lineIndex === lineIndex &&
                      entry.wordIndex === wordIndex
                  )
                  ?.typedChars.slice(word.length)
                  .map((char, charIndex) => {
                    return charIndex + word.length + 1 === currChar &&
                      wordIndex === currWord &&
                      lineIndex === currLine ? (
                      <span
                        key={`${lineIndex}-${wordIndex}-${charIndex}`}
                        className="text-red-500"
                      >
                        {char}
                        <span className="absolute -translate-x-1 animate-blink text-white">
                          |
                        </span>
                      </span>
                    ) : (
                      <span
                        key={`${lineIndex}-${wordIndex}-${charIndex}`}
                        className="text-red-500"
                      >
                        {char}
                      </span>
                    )
                  })
              : null}
            {wordIndex < line.split(' ').length - 1 &&
              (wordIndex === currWord &&
              lineIndex === currLine &&
              word.length === currChar ? (
                <span key={`space-${lineIndex}-${wordIndex}`}>
                  <span className="absolute -translate-x-1 animate-blink text-white">
                    |
                  </span>{' '}
                </span>
              ) : (
                <span key={`space-${lineIndex}-${wordIndex}`}> </span>
              ))}
          </span>
        ))}
        {lineIndex < snippet.split('\n').length - 1 && <br />}
      </div>
    ))
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-between bg-[#323437] font-['Space_Mono'] text-[#646669]">
      <header></header>
      <main>
        <pre onClick={handlePreClick} className="cursor-text select-none">
          {renderSnippet(snippet)}
        </pre>
        <input
          className="absolute -top-10"
          ref={inputRef}
          // onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        ></input>
        <p>
          Line: {currLine} Word: {currWord} Char: {currChar}
        </p>
      </main>
      <footer></footer>
    </div>
  )
}

export default App

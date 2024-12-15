import { InputEntry } from './App'
import clsx from 'clsx'

const isMatchingChars = (input: InputEntry) =>
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

type SnippetType = {
  snippet: string
  inputRef: React.RefObject<HTMLInputElement>
  isFocused: boolean
  setIsFocused: React.Dispatch<React.SetStateAction<boolean>>
  currLine: number
  setCurrLine: React.Dispatch<React.SetStateAction<number>>
  currWord: number
  setCurrWord: React.Dispatch<React.SetStateAction<number>>
  currChar: number
  setCurrChar: React.Dispatch<React.SetStateAction<number>>
  numSpaceEnterInputs: number
  setNumSpaceEnterInputs: React.Dispatch<React.SetStateAction<number>>
  input: InputEntry[]
  setInput: React.Dispatch<React.SetStateAction<InputEntry[]>>
  startTime: number | null
  setStartTime: React.Dispatch<React.SetStateAction<number | null>>
  endTime: number | null
  setEndTime: React.Dispatch<React.SetStateAction<number | null>>
}
const Snippet = ({
  snippet,
  inputRef,
  isFocused,
  setIsFocused,
  currLine,
  setCurrLine,
  currWord,
  setCurrWord,
  currChar,
  setCurrChar,
  numSpaceEnterInputs,
  setNumSpaceEnterInputs,
  input,
  setInput,
  startTime,
  setStartTime,
  endTime,
  setEndTime
}: SnippetType) => {
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
      setNumSpaceEnterInputs((prev) => prev + 1)
    }
  }

  const handleSpaceKey = (wordsInLine: string[]) => {
    if (currChar === 0 || currWord === wordsInLine.length - 1) {
      return
    }

    // Move to next word
    setCurrWord((prev) => prev + 1)
    setCurrChar(0)
    setNumSpaceEnterInputs((prev) => prev + 1)
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
      setNumSpaceEnterInputs((prev) => prev - 1)
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
    setInput((prevInput) => {
      const newInput = [...prevInput]
      const existingEntryIndex = newInput.findIndex(
        (entry) => entry.lineIndex === currLine && entry.wordIndex === currWord
      )
      if (existingEntryIndex !== -1) {
        newInput[existingEntryIndex].typedChars.push(e.key)
      }

      // Move to next character
      setCurrChar((prev) => prev + 1)

      if (currChar === 0 && currWord === 0 && currLine === 0 && !startTime) {
        setStartTime(Date.now())
      } else if (
        // last character of last word of last line
        currLine === snippet.split('\n').length - 1 &&
        currWord === snippet.split('\n')[currLine].split(' ').length - 1 &&
        currChar ===
          snippet.split('\n')[currLine].split(' ')[currWord].length - 1 &&
        isMatchingChars(
          newInput.find(
            (entry) =>
              entry.lineIndex === currLine && entry.wordIndex === currWord
          ) ?? {
            lineIndex: -1,
            wordIndex: -1,
            actualChars: [],
            typedChars: []
          }
        )
      ) {
        setEndTime(Date.now())
      }

      return newInput
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (endTime) {
      return
    }

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
              isFocused &&
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
                <span
                  key={`${lineIndex}-${wordIndex}-${charIndex}`}
                  className={clsx(
                    char ===
                      input.find(
                        (entry) =>
                          entry.lineIndex === lineIndex &&
                          entry.wordIndex === wordIndex
                      )?.typedChars[charIndex]
                      ? 'text-white'
                      : charIndex <
                          (input.find(
                            (entry) =>
                              entry.lineIndex === lineIndex &&
                              entry.wordIndex === wordIndex
                          )?.typedChars.length ?? 0)
                        ? 'text-red-500'
                        : 'text-[#646669]',
                    !isMatchingChars(
                      input.find(
                        (entry) =>
                          entry.lineIndex === lineIndex &&
                          entry.wordIndex === wordIndex
                      ) ?? {
                        lineIndex: -1,
                        wordIndex: -1,
                        actualChars: [],
                        typedChars: []
                      }
                    ) &&
                      ((currLine == lineIndex && currWord > wordIndex) ||
                        currLine > lineIndex) &&
                      'underline decoration-red-500 decoration-2 underline-offset-2'
                  )}
                >
                  {char}
                </span>
              )
            )}
            {/* Display extra characters typed */}
            {input.find(
              (entry) =>
                entry.lineIndex === lineIndex && entry.wordIndex === wordIndex
            )?.typedChars.length ?? 0 > word.length
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
                        className="text-red-700"
                      >
                        {char}
                        <span className="absolute -translate-x-1 animate-blink text-white">
                          |
                        </span>
                      </span>
                    ) : (
                      <span
                        key={`${lineIndex}-${wordIndex}-${charIndex}`}
                        className={clsx(
                          'text-red-700',
                          !isMatchingChars(
                            input.find(
                              (entry) =>
                                entry.lineIndex === lineIndex &&
                                entry.wordIndex === wordIndex
                            ) ?? {
                              lineIndex: -1,
                              wordIndex: -1,
                              actualChars: [],
                              typedChars: []
                            }
                          ) &&
                            (currWord > wordIndex || currLine > lineIndex) &&
                            'underline decoration-red-500'
                        )}
                      >
                        {char}
                      </span>
                    )
                  })
              : null}
            {wordIndex < line.split(' ').length - 1 &&
              (isFocused &&
              wordIndex === currWord &&
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
    <>
      <pre onClick={handlePreClick} className="cursor-text select-none">
        {renderSnippet(snippet)}
      </pre>
      <input
        className="absolute -top-10"
        ref={inputRef}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
      ></input>
      <p className="mt-4">
        Line: {currLine} Word: {currWord} Char: {currChar}
      </p>
      <p>
        Correct words:
        {input.filter((entry) => isMatchingChars(entry)).length}
      </p>
      <p>
        Correct characters:
        {getNumCorrectChars(input)}
      </p>
      <p>Space/Enter inputs: {numSpaceEnterInputs}</p>
      <p>
        Start time:{' '}
        {startTime ? new Date(startTime).toLocaleTimeString() : 'Not started'}
      </p>
      <p>
        End time:{' '}
        {endTime ? new Date(endTime).toLocaleTimeString() : 'Not finished'}
      </p>
      <p>
        Time taken:{' '}
        {startTime && endTime
          ? ((endTime - startTime) / 1000).toFixed(2)
          : 'Not finished'}
      </p>
      {/* Need 75%+ accuracy to count */}
      <p>Accuracy: {(getAccuracy(input) * 100).toFixed(0)}%</p>
      <p>Raw accuracy: {(getRawAccuracy(input) * 100).toFixed(0)}%</p>
      <p>
        Characters per minute:{' '}
        {startTime && endTime
          ? getCPM(input, startTime, endTime, numSpaceEnterInputs)
          : 'Not finished'}
      </p>
      <p>
        Raw characters per minute:{' '}
        {startTime && endTime
          ? getRawCPM(input, startTime, endTime, numSpaceEnterInputs)
          : 'Not finished'}
      </p>
      <p>getNumCorrectChars: {getNumCorrectChars(input)}</p>
    </>
  )
}

export default Snippet

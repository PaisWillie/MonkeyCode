import { Button, Input } from 'antd'
import axios from 'axios'
import { LeetCodeCategories, LeetCodeDifficulty } from 'data/leetcode-problems'
import { useState } from 'react'
import { FaArrowRight } from 'react-icons/fa6'
import DropdownSelect from './DropdownSelect'

import { MenuProps } from 'antd'
import { LeetcodeProblems } from 'data/leetcode-problems'
import { BiText } from 'react-icons/bi'
import { FaSortAlphaDown } from 'react-icons/fa'
import {
  FaAngular,
  FaFlutter,
  FaHashtag,
  FaJava,
  FaPython,
  FaReact,
  FaSwift
} from 'react-icons/fa6'
import { GoXCircleFill } from 'react-icons/go'
import {
  MdAccountTree,
  MdCheckCircle,
  MdDataArray,
  MdDoNotDisturbOn,
  MdOutlineAccountTree,
  MdOutlineCompareArrows
} from 'react-icons/md'
import { PiFileCSharp } from 'react-icons/pi'
import {
  SiCplusplus,
  SiJavascript,
  SiLeetcode,
  SiTypescript
} from 'react-icons/si'
import { TbBinaryTree } from 'react-icons/tb'
import clsx from 'clsx'

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
          "Generate code snippet based on user prompt. Don't include other info other than code snippet (no code comments & no import/export calls)."
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

type snippetTypeOptions =
  | 'LeetCode'
  | 'React'
  | 'Angular'
  | 'SwiftUI'
  | 'Flutter'

type leetCodeLangOptions =
  | 'Python'
  | 'Java'
  | 'C++'
  | 'C#'
  | 'JavaScript'
  | 'TypeScript'

type PromptSelectionProps = {
  setSnippet: (snippet: string) => void
  resetCounter: () => void
  setSelectedPrompt: (prompt: string) => void
  setIsGPTReady: (isGPTReady: boolean) => void
  setShowLoadingBar: (showLoadingBar: boolean) => void
}

const PromptSelection = ({
  setSnippet,
  resetCounter,
  setSelectedPrompt,
  setIsGPTReady,
  setShowLoadingBar
}: PromptSelectionProps) => {
  const [snippetLoading, setSnippetLoading] = useState(false)

  const [snippetType, setSnippetType] = useState<
    snippetTypeOptions | undefined
  >()

  const [snippetWebDevLang, setSnippetWebDevLang] = useState<
    'JavaScript' | 'TypeScript' | undefined
  >()

  const [snippetLeetCodeLang, setSnippetLeetCodeLang] = useState<
    leetCodeLangOptions | undefined
  >()

  // use value of LeetCodeCategories
  const [snippetLeetCodeTopic, setSnippetLeetCodeTopic] = useState<
    LeetCodeCategories | 'a specific problem' | undefined
  >()
  const [snippetLeetCodeDifficulty, setSnippetLeetCodeDifficulty] = useState<
    LeetCodeDifficulty | undefined
  >()

  const [snippetLeetCodeProblemNum, setSnippetLeetCodeProblemNum] =
    useState<number>(0)

  const handleSelectSnippetType = (type: snippetTypeOptions) => {
    setSnippetWebDevLang(undefined)
    setSnippetLeetCodeLang(undefined)
    setSnippetLeetCodeTopic(undefined)
    setSnippetLeetCodeDifficulty(undefined)
    setSnippetLeetCodeProblemNum(0)

    setSnippetWebDevLang(undefined)

    setSnippetType(type)
  }

  const snippetTypes: MenuProps['items'] = [
    {
      key: 'leetcode',
      label: (
        <div
          className="flex items-center gap-2"
          onClick={() => {
            handleSelectSnippetType('LeetCode')
          }}
        >
          <SiLeetcode />
          <p>LeetCode</p>
        </div>
      )
    },
    {
      key: 'react',
      label: (
        <div
          className="flex items-center gap-2"
          onClick={() => handleSelectSnippetType('React')}
        >
          <FaReact />
          <p>React</p>
        </div>
      )
    },
    {
      key: 'angular',
      label: (
        <div
          className="flex items-center gap-2"
          onClick={() => handleSelectSnippetType('Angular')}
        >
          <FaAngular />
          <p>Angular</p>
        </div>
      )
    },
    {
      key: 'swiftui',
      label: (
        <div
          className="flex items-center gap-2"
          onClick={() => handleSelectSnippetType('SwiftUI')}
        >
          <FaSwift />
          <p>SwiftUI</p>
        </div>
      )
    },
    {
      key: 'flutter',
      label: (
        <div
          className="flex items-center gap-2"
          onClick={() => handleSelectSnippetType('Flutter')}
        >
          <FaFlutter />
          <p>Flutter</p>
        </div>
      )
    }
  ]

  const snippetWebDevLangs: MenuProps['items'] = [
    {
      key: 'javascript',
      label: (
        <div
          className="flex items-center gap-2"
          onClick={() => setSnippetWebDevLang('JavaScript')}
        >
          <SiJavascript />
          <p>JavaScript</p>
        </div>
      )
    },
    {
      key: 'typescript',
      label: (
        <div
          className="flex items-center gap-2"
          onClick={() => setSnippetWebDevLang('TypeScript')}
        >
          <SiTypescript />
          <p>TypeScript</p>
        </div>
      )
    }
  ]

  const handleSelectSnippetLeetCodeLang = (lang: leetCodeLangOptions) => {
    setSnippetLeetCodeTopic(undefined)
    setSnippetLeetCodeProblemNum(0)

    setSnippetLeetCodeLang(lang)
  }

  const snippetLeetCodeLangs: MenuProps['items'] = [
    {
      key: 'python',
      label: (
        <div
          className="flex items-center gap-2"
          onClick={() => handleSelectSnippetLeetCodeLang('Python')}
        >
          <FaPython />
          <p>Python</p>
        </div>
      )
    },
    {
      key: 'java',
      label: (
        <div
          className="flex items-center gap-2"
          onClick={() => handleSelectSnippetLeetCodeLang('Java')}
        >
          <FaJava />
          <p>Java</p>
        </div>
      )
    },
    {
      key: 'c++',
      label: (
        <div
          className="flex items-center gap-2"
          onClick={() => handleSelectSnippetLeetCodeLang('C++')}
        >
          <SiCplusplus />
          <p>C++</p>
        </div>
      )
    },
    {
      key: 'c#',
      label: (
        <div
          className="flex items-center gap-2"
          onClick={() => handleSelectSnippetLeetCodeLang('C#')}
        >
          <PiFileCSharp />
          <p>C#</p>
        </div>
      )
    },
    {
      key: 'javascript',
      label: (
        <div
          className="flex items-center gap-2"
          onClick={() => handleSelectSnippetLeetCodeLang('JavaScript')}
        >
          <SiJavascript />
          <p>JavaScript</p>
        </div>
      )
    },
    {
      key: 'typescript',
      label: (
        <div
          className="flex items-center gap-2"
          onClick={() => handleSelectSnippetLeetCodeLang('TypeScript')}
        >
          <SiTypescript />
          <p>TypeScript</p>
        </div>
      )
    }
  ]

  const handleSelectSnippetLeetCodeTopic = (
    topic: LeetCodeCategories | 'a specific problem'
  ) => {
    setSnippetLeetCodeDifficulty(undefined)
    setSnippetLeetCodeProblemNum(0)

    setSnippetLeetCodeTopic(topic)
  }

  const snippetLeetCodeTopics: MenuProps['items'] = [
    {
      key: 'arrays',
      label: (
        <div
          className="flex items-center gap-2"
          onClick={() => handleSelectSnippetLeetCodeTopic('Arrays')}
        >
          <MdDataArray />
          <p>Arrays</p>
        </div>
      )
    },
    {
      key: 'strings',
      label: (
        <div
          className="flex items-center gap-2"
          onClick={() => handleSelectSnippetLeetCodeTopic('Strings')}
        >
          <BiText />
          <p>Strings</p>
        </div>
      )
    },
    {
      key: 'sorting',
      label: (
        <div
          className="flex items-center gap-2"
          onClick={() => handleSelectSnippetLeetCodeTopic('Sorting')}
        >
          <FaSortAlphaDown />
          <p>Sorting</p>
        </div>
      )
    },
    {
      key: 'dfs',
      label: (
        <div
          className="flex items-center gap-2"
          onClick={() => handleSelectSnippetLeetCodeTopic('DFS')}
        >
          <MdAccountTree />
          <p>DFS</p>
        </div>
      )
    },
    {
      key: 'bfs',
      label: (
        <div
          className="flex items-center gap-2"
          onClick={() => handleSelectSnippetLeetCodeTopic('BFS')}
        >
          <MdOutlineAccountTree />
          <p>BFS</p>
        </div>
      )
    },
    {
      key: 'binary-search',
      label: (
        <div
          className="flex items-center gap-2"
          onClick={() => handleSelectSnippetLeetCodeTopic('Binary Search')}
        >
          <TbBinaryTree />
          <p>Binary Search</p>
        </div>
      )
    },
    {
      key: 'two-pointer',
      label: (
        <div
          className="flex items-center gap-2"
          onClick={() => handleSelectSnippetLeetCodeTopic('Two Pointer')}
        >
          <MdOutlineCompareArrows />
          <p>Two Pointer</p>
        </div>
      )
    },
    {
      key: 'a specific problem',
      label: (
        <div
          className="flex items-center gap-2"
          onClick={() => handleSelectSnippetLeetCodeTopic('a specific problem')}
        >
          <FaHashtag />
          <p>a specific problem</p>
        </div>
      )
    }
  ]

  const snippetLeetCodeDifficulties: MenuProps['items'] = [
    {
      key: 'easy',
      label: (
        <div
          className="flex items-center gap-2"
          onClick={() => setSnippetLeetCodeDifficulty('Easy')}
        >
          <MdCheckCircle />
          <p>Easy</p>
        </div>
      )
    },
    {
      key: 'medium',
      label: (
        <div
          className="flex items-center gap-2"
          onClick={() => setSnippetLeetCodeDifficulty('Medium')}
        >
          <MdDoNotDisturbOn />
          <p>Medium</p>
        </div>
      )
    },
    {
      key: 'hard',
      label: (
        <div
          className="flex items-center gap-2"
          onClick={() => setSnippetLeetCodeDifficulty('Hard')}
        >
          <GoXCircleFill />
          <p>Hard</p>
        </div>
      )
    }
  ]

  return (
    <div
      className={clsx([
        'flex flex-row items-center gap-2 text-slate-200 transition-all',
        snippetLoading && 'opacity-50'
      ])}
    >
      <p>I want to type</p>
      <DropdownSelect items={snippetTypes} label={snippetType} />

      {(snippetType === 'React' || snippetType === 'Angular') && (
        <>
          <p>with</p>
          <DropdownSelect
            items={snippetWebDevLangs}
            label={snippetWebDevLang}
          />
        </>
      )}

      {snippetType === 'LeetCode' && (
        <>
          <p>with</p>
          <DropdownSelect
            items={snippetLeetCodeLangs}
            label={snippetLeetCodeLang}
          />
          {snippetLeetCodeLang && (
            <>
              <p>about</p>
              <DropdownSelect
                items={snippetLeetCodeTopics}
                label={snippetLeetCodeTopic}
              />
              {snippetLeetCodeTopic !== undefined &&
                snippetLeetCodeTopic !== 'a specific problem' && (
                  <>
                    <p>on</p>
                    <DropdownSelect
                      items={snippetLeetCodeDifficulties}
                      label={snippetLeetCodeDifficulty}
                    />
                    <p>difficulty</p>
                  </>
                )}
              {snippetLeetCodeTopic === 'a specific problem' && (
                <>
                  <p>#</p>
                  <Input
                    type="number"
                    min={1}
                    max={3389}
                    value={snippetLeetCodeProblemNum}
                    onChange={(e) => {
                      const inputValue = e.target.value
                      const inputNum = parseInt(inputValue)

                      if (
                        inputValue === '' ||
                        (inputNum >= 0 && inputNum <= 3389)
                      ) {
                        setSnippetLeetCodeProblemNum(inputNum)
                      }
                    }}
                    className="max-w-fit"
                  />
                </>
              )}
            </>
          )}
        </>
      )}
      <Button
        size="small"
        color="primary"
        variant="solid"
        shape="circle"
        icon={<FaArrowRight />}
        disabled={snippetLoading}
        onClick={async () => {
          setIsGPTReady(false)
          setShowLoadingBar(true)
          setSnippetLoading(true)
          let prompt = ''

          if (snippetType === 'LeetCode') {
            let problemNum = -1

            if (snippetLeetCodeTopic === 'a specific problem') {
              prompt = `Leetcode ${snippetLeetCodeLang} problem #${snippetLeetCodeProblemNum}`
            } else {
              if (!snippetLeetCodeDifficulty) {
                console.error('Difficulty not selected')
                return
              }

              if (snippetLeetCodeTopic === 'Arrays') {
                problemNum =
                  LeetcodeProblems.Arrays[snippetLeetCodeDifficulty][
                    Math.floor(
                      Math.random() *
                        LeetcodeProblems.Arrays[snippetLeetCodeDifficulty]
                          .length
                    )
                  ]
              } else if (snippetLeetCodeTopic === 'Strings') {
                problemNum =
                  LeetcodeProblems.Strings[snippetLeetCodeDifficulty][
                    Math.floor(
                      Math.random() *
                        LeetcodeProblems.Strings[snippetLeetCodeDifficulty]
                          .length
                    )
                  ]
              } else if (snippetLeetCodeTopic === 'Sorting') {
                problemNum =
                  LeetcodeProblems.Sorting[snippetLeetCodeDifficulty][
                    Math.floor(
                      Math.random() *
                        LeetcodeProblems.Sorting[snippetLeetCodeDifficulty]
                          .length
                    )
                  ]
              } else if (snippetLeetCodeTopic === 'DFS') {
                problemNum =
                  LeetcodeProblems.DFS[snippetLeetCodeDifficulty][
                    Math.floor(
                      Math.random() *
                        LeetcodeProblems.DFS[snippetLeetCodeDifficulty].length
                    )
                  ]
              } else if (snippetLeetCodeTopic === 'BFS') {
                problemNum =
                  LeetcodeProblems.BFS[snippetLeetCodeDifficulty][
                    Math.floor(
                      Math.random() *
                        LeetcodeProblems.BFS[snippetLeetCodeDifficulty].length
                    )
                  ]
              } else if (snippetLeetCodeTopic === 'Binary Search') {
                problemNum =
                  LeetcodeProblems['Binary Search'][snippetLeetCodeDifficulty][
                    Math.floor(
                      Math.random() *
                        LeetcodeProblems['Binary Search'][
                          snippetLeetCodeDifficulty
                        ].length
                    )
                  ]
              } else if (snippetLeetCodeTopic === 'Two Pointer') {
                problemNum =
                  LeetcodeProblems['Two Pointer'][snippetLeetCodeDifficulty][
                    Math.floor(
                      Math.random() *
                        LeetcodeProblems['Two Pointer'][
                          snippetLeetCodeDifficulty
                        ].length
                    )
                  ]
              }

              prompt = `Leetcode ${snippetLeetCodeLang} problem #${problemNum}`
            }

            setSelectedPrompt(
              `${snippetType} ${snippetLeetCodeLang} ${snippetLeetCodeTopic} ${snippetLeetCodeDifficulty}`
            )
          } else if (snippetType === 'React' || snippetType === 'Angular') {
            prompt = `${snippetType} ${snippetWebDevLang} example`

            setSelectedPrompt(`${snippetType} ${snippetWebDevLang}`)
          } else {
            prompt = `${snippetType} example`

            setSelectedPrompt(`${snippetType}`)
          }

          console.log(prompt)

          const response = await getOpenAIResponse(prompt)
          setSnippet(response.choices[0].message.content)
          setIsGPTReady(true)
          setSnippetLoading(false)
          resetCounter()
        }}
      />
    </div>
  )
}

export default PromptSelection

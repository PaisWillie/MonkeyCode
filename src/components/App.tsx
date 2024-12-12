import axios from 'axios'
import { useState } from 'react'

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY

const openai = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
})

export const getOpenAIResponse = async (prompt: string) => {
  const response = await openai.post('/chat/completions', {
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'Generate a code snippet based on the user prompt. Do not include other information other than the code snippet.'
      },
      { role: 'user', content: prompt }
    ]
  })
  return response.data
}

function App() {
  const [response, setResponse] = useState('')

  return (
    <div>
      <button
        onClick={async () => {
          const response = await getOpenAIResponse(
            'Leetcode Java medium sliding window problem'
          )
          setResponse(response.choices[0].message.content)
          console.log(response)
        }}
      >
        Generate
      </button>
      <pre>{response}</pre>
    </div>
  )
}

export default App

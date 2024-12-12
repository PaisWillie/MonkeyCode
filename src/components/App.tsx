import { useRef, useState } from 'react'

const snippet = `def threeSum(nums):
    nums.sort()  # Sort the array to make it easier to skip duplicates
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

# Example usage
nums = [-1, 0, 1, 2, -1, -4]
print(threeSum(nums))
`

function App() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [input, setInput] = useState<string>('')

  const handlePreClick = () => {
    inputRef.current?.focus()
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-between bg-[#323437] font-['Space_Mono'] text-[#646669]">
      <header></header>
      <main>
        <pre onClick={handlePreClick}>{snippet}</pre>
        <input
          className="absolute -top-10"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></input>
        <p>Value: {input}</p>
      </main>
      <footer></footer>
    </div>
  )
}

export default App

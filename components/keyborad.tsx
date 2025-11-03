'use client'
import React, { useState } from 'react'

interface NumberPadProps {
  onSubmit: (score: string) => void
}

const NumberPad: React.FC<NumberPadProps> = ({ onSubmit }) => {
  const [input, setInput] = useState<string>('')

  const handleClick = (value: string) => {
    if (value === 'back') {
      setInput(prev => prev.slice(0, -1))
    } else if (value === 'enter') {

      if (input !== '') {
        if(Number(input)>180)setInput('三镖分数超过180')
        else {
          onSubmit(input)
        setInput('')
        }

      }
    } else {
      // 限制最多3位数字（比如飞镖分数0-180）
      if (input.length < 3) {
        setInput(prev => prev + value)
      }
      else setInput(value)
    }
  }

  const keys = [
    ['1', '2', '3','4','5','back'],
    ['6', '7', '8','9','0','enter'],
  ]

  return (
    <div className="w-64 bg-gray-800 p-4 rounded-2xl shadow-lg text-white">
      <div className="text-right text-2xl mb-4 bg-gray-700 p-2 rounded">{input || 0}</div>
      <div className="grid grid-cols-3 gap-3">
        {keys.flat().map((key) => {
          const isSpecial = key === 'back' || key === 'enter'
          const display =
            key === 'back' ? '←' :
            key === 'enter' ? '⏎' : key

          return (
            <button
              key={key}
              onClick={() => handleClick(key)}
              className={`p-3 rounded-xl text-xl font-semibold ${
                isSpecial
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
            >
              {display}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default NumberPad

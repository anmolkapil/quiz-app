"use client"

import React, { useEffect, useState } from "react"

import { Quiz, quizzesSchema } from "./zod"

export default function QuizApp() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [selectedQuizIndex, setSelectedQuizIndex] = useState<number | null>(
    null
  )
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const response = await fetch("/data.json")
        if (!response.ok) {
          throw new Error("Failed to fetch quizzes")
        }
        const data = await response.json()

        // Validate data with Zod
        quizzesSchema.parse(data) // Throws an error if validation fails

        setQuizzes(data.quizzes)
      } catch (error) {
        console.error("Error:", error)
      }
    }

    fetchQuizzes()
  }, [])

  const handleQuizSelect = (index: number) => {
    setSelectedQuizIndex(index)
    setCurrentQuestionIndex(0)
  }

  const handleNextQuestion = () => {
    if (
      selectedQuizIndex !== null &&
      currentQuestionIndex < quizzes[selectedQuizIndex].questions.length - 1
    ) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  if (quizzes.length === 0) {
    return <div>Loading quizzes...</div>
  }

  return (
    <div className="p-5">
      {selectedQuizIndex === null ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">Select a Quiz</h1>
          <div className="grid grid-cols-1 gap-4">
            {quizzes.map((quiz, index) => (
              <button
                key={index}
                onClick={() => handleQuizSelect(index)}
                className="p-4 border rounded shadow hover:bg-gray-100"
              >
                <img
                  src={quiz.icon}
                  alt={`${quiz.title} icon`}
                  className="inline-block w-6 mr-2"
                />
                <span>{quiz.title}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">
            {quizzes[selectedQuizIndex].title} Quiz
          </h2>
          <div className="border p-4 mb-4">
            <h3 className="text-lg font-semibold">
              {
                quizzes[selectedQuizIndex].questions[currentQuestionIndex]
                  .question
              }
            </h3>
            <ul className="list-disc pl-5 mt-2">
              {quizzes[selectedQuizIndex].questions[
                currentQuestionIndex
              ].options.map((option, i) => (
                <li key={i}>{option}</li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="p-2 bg-gray-200 rounded disabled:bg-gray-100"
            >
              Previous
            </button>
            <button
              onClick={handleNextQuestion}
              disabled={
                selectedQuizIndex === null ||
                currentQuestionIndex ===
                  quizzes[selectedQuizIndex].questions.length - 1
              }
              className="p-2 bg-blue-500 text-white rounded disabled:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

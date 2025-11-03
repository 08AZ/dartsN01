"use client"

import type React from "react"
import { useState } from "react"
import ToLast from "@/components/ui/to-last-buttom";
import Cookie from "js-cookie"
export default function ParticipantJoin() {
  const [participantCode, setParticipantCode] = useState("")
  const [isAdded, setIsAdded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [token, setToken] = useState(Cookie.get("token"))

  const addParticipant = async (participantCode: string) => {
    return await fetch("api/addParticipant", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json",
      authorization: `Bearer ${token}`},
      body: JSON.stringify({
        participantCode: participantCode,
      }),
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const code = formData.get("ParticipantCode") as string

    if (!code.trim()) {
      setError("请输入参赛码")
      setIsLoading(false)
      return
    }

    try {
      const res = await addParticipant(code)
      const resData = await res.json()

      if (res.ok) {
        setIsAdded(true)
        setParticipantCode(code)
      } else {
        setError(resData.message || "加入失败，请检查参赛码是否正确")
      }
    } catch (err) {
      setError("网络错误，请稍后重试")
    } finally {
      setIsLoading(false)
    }
  }

  return (

    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50 dark:from-slate-950 dark:via-purple-950/30 dark:to-slate-950 p-4 relative overflow-hidden">
      <ToLast></ToLast>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-purple-500/10 dark:bg-purple-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-pink-500/10 dark:bg-pink-400/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">

        {!isAdded ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-800 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-purple-500/50" />

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 dark:bg-purple-400/10 mb-4">
                <svg
                  className="w-8 h-8 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>

              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2 text-balance">参赛加入</h1>
              <p className="text-slate-600 dark:text-slate-400 text-pretty">请输入您的参赛码以加入比赛</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="ParticipantCode"
                  className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4 text-slate-600 dark:text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                  参赛码
                </label>
                <input
                  id="ParticipantCode"
                  name="ParticipantCode"
                  type="text"
                  placeholder="输入参赛码"
                  className="w-full text-lg h-12 px-4 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 text-base font-medium rounded-lg bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    加入中...
                  </span>
                ) : (
                  "加入比赛"
                )}
              </button>

              {error && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 animate-in fade-in slide-in-from-top-2 duration-300">
                  <svg
                    className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
            </form>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-800 backdrop-blur-sm text-center animate-in fade-in zoom-in duration-500">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 dark:bg-green-400/10 mb-6 animate-in zoom-in duration-700">
              <svg
                className="w-10 h-10 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">加入成功！</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">您已成功加入比赛</p>

            <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">参赛码</p>
              <p className="text-lg font-mono font-semibold text-slate-900 dark:text-slate-100">{participantCode}</p>
            </div>

            <button
              onClick={() => {
                setIsAdded(false)
                setParticipantCode("")
                setError("")
              }}
              className="w-full h-12 text-base font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
            >
              返回
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

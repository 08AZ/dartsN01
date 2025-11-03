"use client"
import type React from "react"
import { useState } from "react"
import Cookie from "js-cookie";
import { useRouter } from 'next/navigation';
export default function LoginForm() {
  const [activeTab, setActiveTab] = useState<"login" | "register" | "reset">("login")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)  // 清除之前的错误信息

    const formData = new FormData(e.currentTarget)
    const account = formData.get("account") as string
    const password = formData.get("password") as string

    console.log("登录:", { account, password })
    //******记得删除******//
     router.push("/mainpage")
    return
    //******************//
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ account, password }),  // 将表单数据作为 JSON 发送
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      })

      if (res.ok) {
        const resData = await res.json()

        // 假设后端返回了一个 token
        if (resData.token) {
          Cookie.set('authToken', resData.token, { expires: 1, secure: true, httpOnly: true });
          router.push("/mainpage")
        } else {
          setError("登录失败，未返回有效的 token")
        }
      } else {
        const errorData = await res.json()
        setError(errorData.error || "登录失败，请检查用户名和密码")
      }

    } catch (err) {
      console.error("登录请求出错:", err)
      setError("发生了一个错误，请稍后再试")
    }

    setIsLoading(false)
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const account = formData.get("account") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      alert("密码不一致")
      setIsLoading(false)
      return
    }

    // 这里添加你的注册逻辑
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({ account, password }),  // 将表单数据作为 JSON 发送
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      })

      if (res.ok) {
        const resData = await res.json()
          alert("注册成功！请登录")
        }
        else {
        const errorData = await res.json()
        setError(errorData.error || "注册失败，请检查用户名和密码")
      }

    } catch (err) {
      console.error("注册请求出错:", err)
      setError("发生了一个错误，请稍后再试")
    }

    setIsLoading(false)
  }

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string

    // 这里添加你的重置密码逻辑
    console.log("重置密码:", { email })

    setTimeout(() => {
      setIsLoading(false)
      alert("重置链接已发送到您的邮箱")
    }, 1000)
  }

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">欢迎使用飞镖对战平台</h1>
        <p className="text-sm text-gray-600 mt-1">登录或创建新账号</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === "login" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            登录
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === "register" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            注册
          </button>
          {/*<button
            type="button"
            onClick={() => setActiveTab("reset")}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === "reset" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            重置
          </button>*/}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="login-account" className="block text-sm font-medium text-gray-700 mb-1">
                账号
              </label>
              <input
                id="login-account"
                name="account"
                type="text"
                placeholder="your account"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                密码
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "登录中..." : "登录"}
            </button>
          </form>
        )}

        {/* Register Tab */}
        {activeTab === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="register-account" className="block text-sm font-medium text-gray-700 mb-1">
                账号
              </label>
              <input
                id="register-account"
                name="account"
                type="text"
                placeholder="your account"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">
                密码
              </label>
              <input
                id="register-password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                确认密码
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "注册中..." : "注册"}
            </button>
          </form>
        )}

        {/* Reset Tab */}
        {activeTab === "reset" && (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">
                邮箱
              </label>
              <input
                id="reset-email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <p className="text-sm text-gray-600">我们将向您的邮箱发送重置密码链接</p>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "发送中..." : "发送重置链接"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

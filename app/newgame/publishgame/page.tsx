'use client'
import { useEffect, useState } from "react";
import type React from "react"
import { useRouter } from 'next/navigation';
import Cookie from "js-cookie";
// 返回主页的箭头组件
function ToMenu() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/mainpage')}
      className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors duration-200"
    >
      <svg
        className="w-6 h-6 text-gray-600"
        viewBox="0 0 1024 1024"
        fill="currentColor"
      >
        <path d="M461.994667 512l211.2 211.2-60.330667 60.373333L341.333333 512l271.530667-271.530667 60.330667 60.330667-211.2 211.2z" />
      </svg>
    </button>
  );
}

export default function PublishGame() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("123456");
  const [judgeCode, setJudgeCode] = useState("123456");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const token = Cookie.get("token");
  const handlePublish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/publishGame", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('发布失败，请重试');
      }

      const resData = await response.json();
      setJoinCode(resData.joinCode);
      setJudgeCode(resData.judgeCode);


      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000));


      // 发布成功，跳转到邀请页面
      router.push(`./publishgame/invite?JoinCode=${joinCode}&JudgeCode=${judgeCode}`);
    } catch (error) {
      console.error("发布错误:", error);
      setError(error instanceof Error ? error.message : '发布失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 头部导航 */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center">
          <ToMenu />
          <p className="font-bold w-full text-2xl text-center text-gray-800">dartsn01</p>
          <button
            type="submit"
            form="publish"
            disabled={isLoading}
            className="ml-auto px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all duration-200 disabled:cursor-not-allowed min-w-20"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                发布中
              </span>
            ) : (
              "发布"
            )}
          </button>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="max-w-2xl mx-auto px-4 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">{error}</span>
            <button
              onClick={() => setError("")}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* 表单内容 */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <form
          id="publish"
          onSubmit={handlePublish}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-6 space-y-6"
        >
          {/* 比赛名称 */}
          <div className="space-y-3">
            <label htmlFor="matchName" className="block text-lg font-semibold text-gray-800">
              比赛名称
            </label>
            <input
              id="matchName"
              type="text"
              name="matchName"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg placeholder-gray-400"
              placeholder="请输入比赛名称"
            />
          </div>

          <div className="border-t border-gray-200/60"></div>

          {/* 比赛人数 */}
          <div className="space-y-3">
            <label htmlFor="playerNum" className="block text-lg font-semibold text-gray-800">
              比赛人数
            </label>
            <input
              id="playerNum"
              name="playerNum"
              type="number"
              min="1"
              max="20"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg placeholder-gray-400"
              placeholder="请输入参赛人数"
            />
          </div>

          <div className="border-t border-gray-200/60"></div>

          {/* 比赛分数 */}
          <div className="space-y-3">
            <label className="block text-lg font-semibold text-gray-800">
              比赛分数
            </label>
            <p className="text-sm text-gray-500 mb-2">默认使用301分</p>
            <input
              name="startScore"
              type="number"
              required
              defaultValue={301}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg placeholder-gray-400"
            />
          </div>

          <div className="border-t border-gray-200/60"></div>

          {/* 比赛赛制 */}
          <div className="space-y-3">
            <label className="block text-lg font-semibold text-gray-800">
              比赛赛制
            </label>
            <p className="text-sm text-gray-500 mb-2">默认使用BO3（三局两胜）</p>
            <input
              name="bestOf"
              type="text"
              required
              placeholder="BO3"
              defaultValue={"BO3"}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg placeholder-gray-400"
            />
          </div>

          <div className="border-t border-gray-200/60"></div>

          {/* 单局轮次 */}
          <div className="space-y-3">
            <label className="block text-lg font-semibold text-gray-800">
              单局轮次
            </label>
            <p className="text-sm text-gray-500 mb-2">默认不限制轮数</p>
            <input
              name="limitRounds"
              type="number"
              min="1"
              placeholder="999"
              defaultValue={999}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg placeholder-gray-400"
            />
          </div>
        </form>

        {/* 底部提示 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            发布后将会生成参赛码和裁判码，请妥善保管
          </p>
        </div>
      </div>
    </div>
  );
}
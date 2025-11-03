'use client'; //要检查登陆状态所以是客户端组件
import React, {useEffect, useState} from 'react';
import Image from 'next/image'; // 引入 Next.js Image 组件
import Cookie from 'js-cookie'; // 假设登录状态存储在 Cookie 中
import { useRouter } from 'next/navigation';
export default function ToLast(){
    const handleGoBack = () => {
    window.history.back(); // -1 表示返回上一页
  };
    return (
        <button onClick={handleGoBack} className="fixed  z-50 top-0 left-0 flex flex-row  text-center  y-full items-center ">
            <div className="relative w-10 y-10">
                <svg
        className="icon"
        viewBox="0 0 1024 1024"
        width="50"
        height="50"
      >
        <path
          d="M461.994667 512l211.2 211.2-60.330667 60.373333L341.333333 512l271.530667-271.530667 60.330667 60.330667-211.2 211.2z"
          fill="currentColor"
        />
      </svg>
            </div>
        </button>
    )
}
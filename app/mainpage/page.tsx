'use client'; //要检查登陆状态所以是客户端组件
import React, {useEffect, useState} from 'react';
import Image from 'next/image'; // 引入 Next.js Image 组件
import Cookie from 'js-cookie'; // 假设登录状态存储在 Cookie 中
import { useRouter } from 'next/navigation';

interface ProtectedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string; // 新增 className 属性
}
const ProtectedLink:React.FC<ProtectedLinkProps> = ({ href, children, className }) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // 假设用户登录状态存储在 Cookie 中
    const token = Cookie.get('token');
    if (token) {
      setIsLoggedIn(true); // 如果 token 存在，认为用户已登录
    }
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // 阻止默认的跳转行为

    if (isLoggedIn) {
      router.push(href); // 如果已登录，跳转到指定页面
    } else {
      // 如果未登录，可以提示用户登录，或者重定向到登录页面
      alert('Please log in first');
      router.push('/'); // 重定向到登录页面
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className} // 使用传递进来的 className
    >
      {children}
    </a>
  );
};

export default function MainPage() {
  return (
    <div>
      <div className="bg-blue-900 text-white text-center py-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">dartsn01.com</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-5 justify-items-center">
        <ProtectedLink
          href="../newgame"
          className="block w-full max-w-xs rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
        >
          <div className="relative h-68 w-full  ">
            <Image
              src="/images/n01forWeb.png"
              alt="n01 for Web"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-800">开始比赛</h2>
            <p className="text-gray-600 mt-2">参加或创建比赛</p>
          </div>
        </ProtectedLink>

        <ProtectedLink
          href="../mygame"
          className="block w-full max-w-xs rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
        >
          <div className="relative w-full h-70">
            <Image
              src="/images/mygame.png"
              alt="n01 Online"
              fill
              className="object-contain"
            />
          </div>
          <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-800">我的比赛</h2>
            <p className="text-gray-600 mt-2">与你相关的比赛</p>
          </div>
        </ProtectedLink>


      </div>
    </div>
  );
}



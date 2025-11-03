'use client'
import React,{useState, useEffect } from 'react'
import ToMenu from "@/components/ui/to-last-buttom";
import { useRouter } from 'next/navigation';
import Cookie from "js-cookie";
interface Item {
  id: number
  name: string
  status: string
  startAt: string
}
const exampleItems: Item[] = [
  {
    id: 1,
    name: "清华大学501飞镖比赛",
    status: "未开始",
    startAt: "2024-03-15"
  },
  {
    id: 2,
    name: "北京大学迎新飞镖大赛",
    status: "进行中",
    startAt: "2024-03-10"
  },
  {
    id: 3,
    name: "复旦大学春季飞镖联赛",
    status: "已结束",
    startAt: "2024-02-20"
  },
  {
    id: 4,
    name: "上海交通大学飞镖锦标赛",
    status: "未开始",
    startAt: "2024-04-01"
  },
  {
    id: 5,
    name: "浙江大学校园飞镖杯",
    status: "进行中",
    startAt: "2024-03-08"
  },
  {
    id: 6,
    name: "南京大学冬季飞镖赛",
    status: "已结束",
    startAt: "2024-01-15"
  },
  {
    id: 7,
    name: "武汉大学樱花飞镖节",
    status: "未开始",
    startAt: "2024-03-25"
  },
  {
    id: 8,
    name: "中山大学南方飞镖公开赛",
    status: "进行中",
    startAt: "2024-03-12"
  },
  {
    id: 9,
    name: "四川大学巴蜀飞镖联赛",
    status: "已结束",
    startAt: "2024-02-28"
  },
  {
    id: 10,
    name: "哈尔滨工业大学冰城飞镖赛",
    status: "未开始",
    startAt: "2024-04-05"
  }
]
export default function Mypage(){
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('participated')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [data, setData] = useState<Item[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [error, setError] = useState('')
  const token=Cookie.get('token')
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/mygame/${activeTab}`,{
          method: "GET",
          headers:{
            "Content-Type": "application/json",
            "Authorization":`Bearer${token}`
          }
        })
        if (!response.ok) throw new Error('获取数据失败')
        const result = await response.json()
        setData(result.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取数据失败')
        setData(exampleItems)
      } finally {
        setIsLoading(false)

      }
    }
    fetchData()

  }, [activeTab])
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(data.length / itemsPerPage)
  return (<>
      <div className="min-h-screen flex flex-col gap-3 bg-slate-50 p-5 ">
        <ToMenu/>
        <div className="flex flex-col px-10 gap-2">
          <p className="font-bold text-xl">我的比赛</p>
          <p className="text-slate-600 text-xl">查看与你相关的所有比赛</p>
        </div>
        <div className="flex flex-row w-auto px-5 gap-1 bg-slate-50">
          <button onClick={()=>{setActiveTab('published');setIsLoading(true)}} className={`items-center justify-center flex flex-row flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === "published" ? "bg-white text-gray-900 shadow-sm" : "bg-slate-200 text-gray-600 hover:text-gray-900"
            }`}>
            <img src="/images/publish.png" alt="箭头" className="h-4 w-4" />
            我发布的
          </button>
            <button onClick={()=>{setActiveTab('participated');setIsLoading(true)}} className={`items-center justify-center flex flex-row flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === "participated" ? "bg-white text-gray-900 shadow-sm" : "bg-slate-200 text-gray-600 hover:text-gray-900"
            }`}>
            <img src="/images/trophy.png" alt="箭头" className="h-4 w-4" />
            我参加的
          </button>
            <button onClick={()=>{setActiveTab('judged');setIsLoading(true)}} className={`items-center justify-center flex flex-row flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === "judged" ? "bg-white text-gray-900 shadow-sm" : "bg-slate-200 text-gray-600 hover:text-gray-900"
            }`}>
            <img src="/images/judge.png" alt="箭头" className="h-4 w-4" />
            我裁判的
          </button>
        </div>
        <div className="space-y-4">
        {currentItems.length > 0 ? (
          currentItems.map(item => (
            <div onClick={()=>{router.push(`./mygame/matchDetail?matchId=${item.id}`)}}
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {item.name}
              </h3>
              <p className="text-gray-600 mb-3">{item.status}</p>
              <div className="text-sm text-gray-500">
                创建时间: {new Date(item.startAt).toLocaleDateString()}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            暂无数据
          </div>
        )}
      </div>

{/* 分页组件 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* 分页信息 */}
      <div className="text-center mt-4 text-gray-600">
        显示第 {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, data.length)} 条，
        共 {data.length} 条数据
      </div>
        </div>
  </>
  )
  function Pagination({ currentPage, totalPages, onPageChange }:{currentPage:number,totalPages:number,onPageChange:(page: number) => void}) {
  const pageNumbers = []
  const maxVisiblePages = 1

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      {/* 上一页 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors"
      >
        上一页
      </button>

      {/* 第一页 */}
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            1
          </button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {/* 页码 */}
      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentPage === number
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {number}
        </button>
      ))}

      {/* 最后一页 */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* 下一页 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors"
      >
        下一页
      </button>
    </div>
  )
}
}
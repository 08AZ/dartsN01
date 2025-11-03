'use client'
import {useSearchParams} from "next/navigation";
import React, {Suspense, useEffect, useState} from 'react'
import {DataType} from "csstype";
import { useRouter } from 'next/navigation';
import ToLast from "@/components/ui/to-last-buttom";
import Cookie from "js-cookie";
//弹窗
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: string;
}
// 选手信息类型
interface Player {
  id: string
  nickname: string
  score: number
  area: string
}
// 比赛信息类型
interface Match {
  id: string
  name:string
  date:string
  round: number // 轮次：1=第一轮, 2=第二轮, 以此类推
  matchNumber: number // 该轮次中的比赛编号
  completed: boolean
  player1: Player
  averageEvery3forPlayer1: number
  player2: Player
  averageEvery3forPlayer2: number
  winner: 1 | 2 // 1表示player1获胜，2表示player2获胜
}

// 组件Props（可选，如果不传则使用默认数据）
interface Data{
  id:string,
  name: string,
  totalPlayer: number,
  matches: Match[],
  BO:{key:number,value:string},
  status:string,
}

const defaultLeg: Record<number,number>={
  1:3,
  2:3,
  3:3
}
const defaultName='2025飞镖大赛'


// 默认示例数据：8人单淘汰赛
const defaultMatches: Match[] = [
  // 第一轮（四分之一决赛）
  { id:'1',
    name:"飞镖比赛半决赛",
    date:"2025/10/27 18:03",
    round: 1,
    matchNumber: 1,
    completed:true,
    player1: { id: 'P001', nickname: '闪电侠', score: 3,area:'天津'},
    player2: { id: 'P002', nickname: '影子', score: 1 ,area:'天津'},
    averageEvery3forPlayer1:80,
    averageEvery3forPlayer2:80,
    winner: 1,
  },
  {
    id:'2',
    name:"飞镖比赛半决赛",
    date:"2025/10/27 18:03",
    round: 1,
    matchNumber: 2,
    completed:true,
    player1: { id: 'P003', nickname: '火焰', score: 2 ,area:'天津'},
    player2: { id: 'P004', nickname: '冰霜', score: 3 ,area:'天津'},
    averageEvery3forPlayer1:80,
    averageEvery3forPlayer2:80,
    winner: 2,
  },
  { id:'3',
    name:"飞镖比赛半决赛",
    date:"2025/10/27 18:03",
    round: 1,
    matchNumber: 3,
    completed:true,
    player1: { id: 'P005', nickname: '雷神', score: 3 ,area:'天津'},
    player2: { id: 'P006', nickname: '战神', score: 2 ,area:'天津'},
    averageEvery3forPlayer1:80,
    averageEvery3forPlayer2:80,
    winner: 1,
  },
  { id:'4',
    name:"飞镖比赛半决赛",
    date:"2025/10/27 18:03",
    round: 1,
    matchNumber: 4,
    completed:true,
    player1: { id: 'P007', nickname: '狂风', score: 1 ,area:'天津'},
    player2: { id: 'P008', nickname: '暴雨', score: 3 ,area:'天津'},
    averageEvery3forPlayer1:80,
    averageEvery3forPlayer2:80,
    winner: 2,
  },
  // 第二轮（半决赛）
  { id:'5',
    name:"飞镖比赛半决赛",
    date:"2025/10/27 18:03",
    round: 2,
    matchNumber: 1,
    completed:true,
    player1: { id: 'P001', nickname: '闪电侠', score: 3 ,area:'天津'},
    player2: { id: 'P004', nickname: '冰霜', score: 2 ,area:'天津'},
    averageEvery3forPlayer1:80,
    averageEvery3forPlayer2:80,
    winner: 1,
  },
  { id:'6',
    name:"飞镖比赛半决赛",
    date:"2025/10/27 18:03",
    round: 2,
    matchNumber: 2,
    completed:true,
    player1: { id: 'P005', nickname: '雷神', score: 2 ,area:'天津'},
    player2: { id: 'P008', nickname: '暴雨', score: 3 ,area:'天津'},
    averageEvery3forPlayer1:80,
    averageEvery3forPlayer2:80,
    winner: 2,
  },
  // 第三轮（决赛）
  {
    id:'7',
    name:"飞镖比赛半决赛",
    date:"2025/10/27 18:03",
    round: 3,
    matchNumber: 1,
    completed:true,
    player1: { id: 'P001', nickname: '闪电侠', score: 3 ,area:'天津'},
    player2: { id: 'P008', nickname: '暴雨', score: 1 ,area:'天津'},
    averageEvery3forPlayer1:80,
    averageEvery3forPlayer2:80,
    winner: 1,
  },
]

function BracketTree() {
  const router = useRouter();
  const [matchName, setMatchName] = useState('飞镖比赛')
  const [matches, setMatches] = useState<Match[]>([])
  const [totalPlayer,setTotalPlayer]=useState(8)
  const searchParams = useSearchParams()
  const matchId=searchParams.get('matchId')
  const [matchStatus,setMatchStatus]=useState('completed')
  const [activeTab,setActiveTab]=useState('bracket')
  const [data, setData]=useState<Data>()
  const [isOpen,setIsOpen]=useState(false)
  const [roundId, setRoundId]=useState('')
  const token=Cookie.get('token')
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch(`/api/matches?matchId=${matchId}`,{
          method: 'GET',
          headers:{
            'Content-Type': 'application/json',
            'Authorization':`Bearer${token}`
          }

        })
        if (!res.ok) {
          setMatches(defaultMatches)
          setTotalPlayer(8)
          throw new Error('Failed to fetch matches')
        }
        const data = await res.json()
        setData(data)
        setMatchName(data.name)
        setMatchStatus(data.status)
        setMatches(data.matches)
        setTotalPlayer(data.totalPlayer)
      } catch (err) {
        console.error(err)
      }
    }
    fetchMatches()
  }, [matchId])

  // 计算总轮次
  const totalRounds = Math.ceil(Math.log2(totalPlayer))

  // 按轮次分组比赛
  const matchesByRound: { [key: number]: Match[] } = {}
  matches.forEach(match => {
    if (!matchesByRound[match.round]) {
      matchesByRound[match.round] = []
    }
    matchesByRound[match.round].push(match)
  })

  // 获取冠军赛
  const champion = matches.find(m => m.round === totalRounds)

  // 渲染单个选手卡片
  const renderPlayer = (player: Player, isWinner: boolean,averageEvery3:number) => <div
    className={`flex items-center justify-between p-3 rounded-lg transition-all ${
      isWinner
        ? 'bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-400'
        : 'bg-white border border-gray-200'
    }`}
  >
    <div className="flex items-center gap-3 flex-1">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
          isWinner ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
        }`}
      >
        {player.id.slice(-2)}
      </div>
      <div className="flex-1">
        <div className={`font-semibold ${isWinner ? 'text-green-900' : 'text-gray-800'}`}>
          {player.nickname+'-'+player.area}
        </div>
        <div className="text-xs text-gray-500">{averageEvery3}</div>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <div
        className={`text-2xl font-bold ${isWinner ? 'text-green-600' : 'text-gray-400'}`}
      >
        {player.score}
      </div>
      {isWinner && <svg
          className="w-5 h-5 text-green-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>}
    </div>
  </div>

  // 渲染单场比赛
  const renderMatch = (match: Match) => <div
      onClick={()=>{setRoundId(match.id);setIsOpen(true)}}
    key={`${match.round}-${match.matchNumber}`}
    className="relative bg-white rounded-xl shadow-lg p-4 border-2 border-gray-100 hover:shadow-xl transition-shadow min-w-[280px]"
  >
    <div className="absolute -top-3 left-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
      第{match.round}轮 #{match.matchNumber}
    </div>
    <div className="space-y-3 mt-2">
      {renderPlayer(match.player1, match.winner === 1,match.averageEvery3forPlayer1)}
      <div className="flex items-center justify-center">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        <span className="px-3 text-xs font-bold text-gray-400">VS</span>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>
      {renderPlayer(match.player2, match.winner === 2,match.averageEvery3forPlayer2)}
    </div>
  </div>

  // 渲染轮次标题
  const getRoundTitle = (round: number) => {
    if (round === totalRounds) return `决赛`
    if (round === totalRounds - 1) return `半决赛`
    if (round === totalRounds - 2) return `四分之一决赛`
    return `第${round}轮`
  }
  const getRoundLeg=(round:number)=>{
    return `(First to ${defaultLeg[round]} legs)`
  }
  //渲染选项窗口
  const Modal: React.FC<ModalProps> = ({ isOpen, onClose ,matchId}) => {

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-500/50 flex items-center justify-center z-50 p-4"
      onClick={onClose} // 点击遮罩关闭
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col gap-3 "
        onClick={(e) => e.stopPropagation()} // 阻止事件冒泡
      >
        <button className='text-blue-500 mb-3 mt-3' onClick={()=>{router.push(`./matchDetail/checkMatchTable?roundId=${matchId}`)}}>查看比分细表</button>
        <button className='text-blue-500 mb-3 mt-3' onClick={()=>{router.push(`./matchDetail/judgeMatchTable?roundId=${matchId}`)}}>打分</button>
      </div>
    </div>
  );
};
  //渲染对战列表单个对战
 const renderMatchByRow=(match: Match) => {
    return (

    <div onClick={()=>{setRoundId(match.id);setIsOpen(true)}} className='flex flex-col w-full border border-purple-500 rounded-r-xl shadow-sm'>
      <p>{match.date+'-'+defaultName+getRoundTitle(match.round)}</p>
      <div className='flex gap-5'>
        <div className='flex flex-col  gap-1'>
          <h1 className={`text-xl ${match.winner===1?"font-bold":"text-slate-700"}`}>{match.player1.nickname+'-'+match.player1.area}</h1>
          <h2 className='text-slate-400'>({match.averageEvery3forPlayer1})</h2>
        </div>
        <p className='text-2xl'>{match.player1.score+'-'+match.player2.score}</p>
        <div className='flex flex-col  gap-1 '>
          <h1 className={`text-xl ${match.winner===2?"font-bold":"text-slate-700"}`}>{match.player2.nickname+'-'+match.player2.area}</h1>
          <h2 className='text-slate-400'>({match.averageEvery3forPlayer2})</h2>
        </div>
      </div>
    </div>)
 }
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-5">
    <ToLast></ToLast>
    <div className="max-w-7xl mx-auto">
      {/* 标题区域 */}
      <div className="text-center py-3">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          {matchName}
        </h1>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          {matchStatus}
        </h2>
        <p className="text-gray-600 text-lg">
          {totalPlayer}人单淘汰赛 · 共{totalRounds}轮
        </p>
      </div>
      <div className="flex justify-center items-center mb-5 gap-2 text-xl bg-slate-200 mx-auto w-60 rounded-lg">
        <button onClick={()=>{setActiveTab('bracket')}} className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            activeTab === "bracket" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}>对战树</button>
        <button onClick={()=>setActiveTab('results')} className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
            activeTab === "results" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}>对战列表</button>
      </div>
      {/* 对战图主体 */}
      {activeTab==='bracket'&&
      <div className="overflow-x-auto pb-8 ">
        <div className="flex gap-8 items-start justify-center min-w-max ">
          {Array.from({ length: totalRounds }, (_, i) => i + 1).map(round => <div key={round} className="flex flex-col items-center gap-6">
              {/* 轮次标题 */}
              <div className="sticky top-0 z-10 bg-white rounded-full px-6 py-3 shadow-lg border-2 border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">
                  {getRoundTitle(round)}
                </h2>
                <h3 className="text-lg  text-gray-800">
                  {getRoundLeg(round)}
                </h3>
              </div>

              {/* 该轮次的所有比赛 */}
              <div className="flex flex-col gap-8">
                {matchesByRound[round]?.map(match => <div key={`${match.round}-${match.matchNumber}`} className="relative">
                    {renderMatch(match)}
                    {/* 连接线到下一轮 */}
                    {round < totalRounds && <div className="absolute top-1/2 -right-8 w-8 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>}
                  </div>)}
              </div>
            </div>)}
        </div>
      </div>
      }
      {/* 比赛列表 */}
        {activeTab === 'results' && (
  <div className="relative flex flex-col items-center justify-center w-full gap-3 ">
    {matches.length > 1 ? (
      matches.map(match => (
          renderMatchByRow(match)
      ))
    ) : (
      <div>暂无数据</div>
    )}
  </div>
)}

      {/* 冠军展示 */}
      {champion && <div className="mt-12 flex justify-center">
          <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl p-8 shadow-2xl max-w-md w-full">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-3xl font-bold text-white mb-2">冠军</h3>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {champion.winner === 1
                    ? champion.player1.id.slice(-2)
                    : champion.player2.id.slice(-2)}
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-gray-800">
                    {champion.winner === 1
                      ? champion.player1.nickname
                      : champion.player2.nickname}
                  </div>
                  <div className="text-gray-500">
                    {champion.winner === 1 ? champion.player1.id : champion.player2.id}
                  </div>
                </div>
                <div className="text-4xl font-bold text-yellow-600">
                  {champion.winner === 1 ? champion.player1.score : champion.player2.score}
                </div>
              </div>
            </div>
          </div>
        </div>}
    </div>
    <Modal isOpen={isOpen} onClose={()=>{setIsOpen(false)}} matchId={roundId}></Modal>
  </div>

}
export default function Page() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <BracketTree/>
    </Suspense>
  )
}
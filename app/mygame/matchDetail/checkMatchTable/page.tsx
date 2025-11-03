'use client'
import React,{useState,useEffect} from "react";
import {useSearchParams} from "next/navigation";
import ToLast from "@/components/ui/to-last-buttom";
export interface player{
    id:string
    nickname: string;
    area:string;
}
export interface MatchDetailProps {
    limitRounds:number;
    completed:boolean;
    BO:number
    legs:number
    startScore:number
    roundId: string;
    roundName: string;
    player1:player
    player2:player
    p1Score:string[][]
    p2Score:string[][]
    p1TotalScore:number,
    p2TotalScore:number,
    isFirstHand:boolean[],
}
const defaultMatchDetailProps:MatchDetailProps = {
    isFirstHand:[true,false,true],
    limitRounds:15,
    completed:false,
    BO:5,
    legs:3,
    startScore: 501,
    roundId: "1",
    roundName: "2024年飞镖大赛决赛",
    player1: {
        id:'001',
        nickname:'张飞',
        area:"蜀汉"
    },
    player2:{
        id:'002',
        nickname:'曹操',
        area:'东吴'
    },
    p1Score:[
        ['96','140','133','92','X1'],
        ['96','140','133','92',],
        ['96','140','133','92','X1']
    ],
    p2Score:[
        ['96','140','133','92'],
        ['96','140','133','92','X1'],
        ['96','140','133','92',]
    ],
    p1TotalScore:2,
    p2TotalScore:1
}
export default function MatchTable() {
    const [matchDetail, setMatchDetail] = useState<MatchDetailProps>(defaultMatchDetailProps);
    const searchParams = useSearchParams()
    const roundId =searchParams.get("roundId")
    const [auth, setAuth] = useState<string>("")
    const [startScore, setStartScore] = useState<number>(501)
    const [limitRounds, setLimitRounds] = useState(15)
    const [p1score, setP1score] = useState<string[]>([''])
    const [p2score, setP2score] = useState<string[]>([''])
    const [legs, setLegs] = useState<number>(1)
    const [p1TotalScore, setP1TotalScore] = useState<number>(0)
    const [p2TotalScore, setP2TotalScore] = useState<number>(0)
    const [token, setToken] = useState<string>("")
    const [player1, setPlayer1] = useState({id:'', nickname:'',area:''})
    const [player2, setPlayer2] = useState({id:'', nickname:'',area:''})
    const [isFirstHand, setIsFirstHand] = useState<boolean[]>([true,false,true])
    useEffect(()=>{
        const fetchMatchTable=async ()=>{
            try {
        const res = await fetch(`/api/ScoreTable?roundId=${roundId}`,{
            method: "GET",
            credentials: "include",
        })
        if (!res.ok) {
          throw new Error('Failed to fetch matches')
        }
        const data = await res.json()
        setMatchDetail(data)
      } catch (err) {
        console.error(err)
                setMatchDetail(defaultMatchDetailProps)
      }
      setStartScore(matchDetail.startScore);
                setLimitRounds(matchDetail.limitRounds);
                setLegs(matchDetail.legs);
                setP1score(matchDetail.p1Score[matchDetail.legs - 1])
                setP2score(matchDetail.p2Score[matchDetail.legs - 1])
                setP1TotalScore(matchDetail.p1TotalScore)
                setP2TotalScore(matchDetail.p2TotalScore)
                setPlayer1(matchDetail.player1)
            setPlayer2(matchDetail.player2)
            setIsFirstHand(matchDetail.isFirstHand)
    }
    fetchMatchTable()
    },[])


    const calcRemaining = (darts: number[]) => {//获得实时的剩余分数
        let remaining = startScore;
        return darts.map(score => {
            const r = remaining - score;
            remaining -= score;
            if (isNaN(r)) return '-'
            return String(r);
        });
    };
    const p1Remaining = calcRemaining(p1score.map(Number));
    const p2Remaining = calcRemaining(p2score.map(Number));

    return (
        <div className="min-h-screen ">
            <div className="flex">
                <ToLast/>
                <h1 className='mx-auto mt-3 text-2xl'>{matchDetail.roundName}得分细表</h1>
            </div>
            <div className="flex flex-col w-full gap-5 px-5 py-5">


            {Array.from({ length: legs }).map((_, index) => (
                    <div key={index} className="flex flex-col w-full">
                        <div className="flex w-full">
                            <span className='mr-auto'>{player1.nickname}-{player1.area}({isFirstHand?'先手':'后手'})</span>
                            <span className='mx-auto'>{index+1} Leg</span>
                            <span className='ml-auto'>{player2.nickname}-{player2.area}({isFirstHand?'后手':'先手'})</span>
                        </div>
                        <table className="min-w-full border border-gray-300 text-center">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-2 py-1 border">得分</th>
                        <th className="px-2 py-1 border">{startScore}</th>
                        <th className="px-2 py-1 border"></th>
                        <th className="px-2 py-1 border">得分</th>
                        <th className="px-2 py-1 border">{startScore}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Array.from({length: p1score.length}).map((_, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                            <td className="border px-2 py-1">{p1score[i] ?? '-'}</td>
                            <td className="border px-2 py-1">{p1Remaining[i] ?? '-'}</td>
                            <td className="border px-2 py-1 bg-gray-50">{i===limitRounds?'':(i + 1) * 3}</td>
                            <td className="border px-2 py-1">{p2score[i] ?? '-'}</td>
                            <td className="border px-2 py-1">{p2Remaining[i] ?? '-'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                    </div>
            ))
            }</div>
            <div>

            </div>


        </div>
    )
}
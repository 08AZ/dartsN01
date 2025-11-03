'use client'

import {start} from "node:repl";

interface ModalProps {
  isOpen: boolean;

}
interface RequestData {
  timestamp: number;
  data: any;
}
import React, {Suspense, useEffect, useRef, useState} from "react"
import Cookie from "js-cookie"
import { useSearchParams } from "next/navigation"
import {MatchDetailProps} from "@/app/mygame/matchDetail/checkMatchTable/page";
import NumberPad from "@/components/keyborad";
const defaultMatchDetailProps:MatchDetailProps = {
    isFirstHand:[true,false,true],
    limitRounds:5,
    completed:false,
    BO:5,
    legs: 3,//进行到第三回合 但第三回合不一定开始
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
        ['96','140','133','92','12','X1'],
        ['96','140','133','92','X1'],
        ['96','140','133','92',]
    ],
    p2Score:[
        ['96','140','133','92'],
        ['96','140','133','92','12'],
        ['96','140','133','91',]
    ],
    p1TotalScore:2,
    p2TotalScore:1
}


 function JudgePage() {
    const [completed, setCompleted] = useState<boolean>(false)
    const [auth, setAuth] = useState<string>("")
    const [matchDetail, setMatchDetail] = useState<MatchDetailProps>(defaultMatchDetailProps)
    const searchParams = useSearchParams()
    const roundId = searchParams.get("roundId")
    const [isSettingOpen, setSettingIsOpen] = useState<boolean>(false);
    const [isFirstHand, setIsFirstHand] = useState<boolean>(true);//选手一是否先手
    const [isNowHand, setIsNowHand] = useState<boolean>(true)//是否是选手一的回合
    const [isStarted, setIsStarted] = useState<boolean>(false)
    const [startScore, setStartScore] = useState<number>(501)
    const [limitRounds, setLimitRounds] = useState(15)
    const [p1score, setP1score] = useState<string[]>([''])
    const [p2score, setP2score] = useState<string[]>([''])
    const [legs, setLegs] = useState<number>(1)
    const [isEndedOpen, setIsEndedOpen] = useState<boolean>(false)
    const [isWinner, setIsWinner] = useState<boolean>(true)
    const [isEnded, setIsEnded] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isUpdateSuccess, setIsUpdateSuccess] = useState<boolean>(false)
    const [p1TotalScore, setP1TotalScore] = useState<number>(0)
    const [p2TotalScore, setP2TotalScore] = useState<number>(0)
    const [token, setToken] = useState<string>("")
    const [player1, setPlayer1] = useState({id:'', nickname:'',area:''})
    const [player2, setPlayer2] = useState({id:'', nickname:'',area:''})
    const [BO, setBo] = useState(5)
    const [RedHeartEndOpen, setRedHeartEndOpen] = useState<boolean>(false)
    const [settable,setSettable] = useState<boolean>(false)
    const [rounds,setRounds]=useState(0)
    useEffect(() => {//鉴权逻辑放在 useEffect 中
        const authentic = async () => {
            try {
                const token = Cookie.get("token")
                setToken(token as string)
                const res = await fetch("/api/authentic", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (!res.ok) throw new Error("认证失败")
                const data = await res.json()
                setAuth(data.role|| "") // 根据后端返回的数据设置角色
            } catch (err) {
                console.error(err)
                setAuth("judge") // 修改
            }
        }

        authentic()
    }, [])


    useEffect(() => {// ✅ 根据 auth 判断是否允许访问
        if (auth && auth !== "judge") {
            alert("无权限")
            window.history.back()
        }
        if (completed) {
            alert('已完赛')
            window.history.back()
        }
    }, [auth,completed])



    useEffect(() => {// ✅ 获取比赛详情并开始比赛 返回数据
        const fetchMatchTable = async () => {
            try {
                const res = await fetch(`/api/ScoreTable?roundId=${roundId}`, {
                    method: "GET",
                })
                if (!res.ok) throw new Error("Failed to fetch matches")
                const data = await res.json()
                setMatchDetail(data)
            } catch (err) {
                console.error(err)
                setMatchDetail(defaultMatchDetailProps)
            }
                const legs=matchDetail.legs
                if(matchDetail.isFirstHand.length===legs){//当前比赛已经开始了
                    setIsFirstHand(matchDetail.isFirstHand[legs-1])
                    setSettable(false)
                    setRounds(matchDetail.isFirstHand[legs-1]?matchDetail.p1Score.length:matchDetail.p2Score.length)
                }
                else{//当前比赛未开始 需要设置先手后手
                    setSettable(true)
                }

                setStartScore(matchDetail.startScore);
                setLimitRounds(matchDetail.limitRounds);
                setLegs(matchDetail.legs);
                setP1score(matchDetail.p1Score[legs-1])
                setP2score(matchDetail.p2Score[legs-1])
                setP1TotalScore(matchDetail.p1TotalScore)
                setP2TotalScore(matchDetail.p2TotalScore)
                setPlayer1(matchDetail.player1)
            setPlayer2(matchDetail.player2)
            setBo(matchDetail.BO)
            setCompleted(matchDetail.completed)

            }
        if (roundId) fetchMatchTable()
    }, [roundId])





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

    function sleep(ms: number) {//时间停止函数
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    const handleEnd = async (endScore: string,isWinner:boolean) => {//结算
        // 更新分数
        const newP1 = isWinner ? [...p1score, endScore] : p1score;
        const newP2 = isWinner ? p2score : [...p2score, endScore];
        setP1TotalScore(isWinner ? p1TotalScore + 1 : p1TotalScore)
        setP2TotalScore(isWinner ? p2TotalScore : p2TotalScore + 1)
        setP1score(newP1);
        setP2score(newP2);
        setIsEndedOpen(false);
        setIsLoading(true);

        // ✅ 直接发送最新分数
        try {
            const token = Cookie.get("token");
            await fetch(`/api/newScore/?roundId=${roundId}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status:((p1TotalScore+(isWinner?1:0))===(Math.ceil(BO/2)))||((p2TotalScore+(isWinner?0:1))===(Math.ceil(BO/2))),
                    p1score: p1score,
                    p2score: p2score,
                    p1TotalScore: p1TotalScore,
                    p2TotalScore: p2TotalScore,
                        legs:legs,
                        isFirstHand: isFirstHand,
                        startScore: startScore,
                        player1:player1,
                        player2:player2,
                    })


            });
            setIsUpdateSuccess(true);
        } catch (err) {
            console.error(err);
            setIsUpdateSuccess(false);
        }
        await sleep(2000); // 等待 2 秒
        setIsLoading(false);
        setP1score([])
        setP2score([])
        setIsEnded(false);
        setIsStarted(true)
        setIsFirstHand(true)
        setIsWinner(true)
        setLegs(legs+1)
        if((p1TotalScore+(isWinner?1:0))===(Math.ceil(BO/2))){setCompleted(true);}
        if((p2TotalScore+(isWinner?0:1))===(Math.ceil(BO/2))){setCompleted(true);}
    };


    function UploadModal({isOpen}: { isOpen: boolean }) {//上传弹窗
        if (!isOpen) return null;

        return (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-700/50"
            >
                <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
                <span className="text-white mt-4">{isUpdateSuccess ? '上传成功' : '正在上传'}</span>
            </div>
        );
    }

    function RedHeartEndModal(props:{isOpen: boolean}) {
        if(!props.isOpen){return null}
        return (<div className="fixed inset-0 bg-slate-700/50 flex-col items-center justify-center z-50 py-50"
                     onClick={()=>{setRedHeartEndOpen(false)}}>
                <div className="mx-auto bg-white rounded-lg shadow-xl w-2/3 max-w-md flex flex-col  "
                     onClick={(e) => e.stopPropagation()}>
                    <h1 className='mx-auto text-red-500 py-3'>红心结镖</h1>
                    <button className='text-center border py-2' onClick={() => {setIsWinner(true);handleEnd('X0',true);setRedHeartEndOpen(false)}}>{matchDetail.player1.nickname} 赢！</button>
                    <button className='text-center border py-2' onClick={() =>{setIsWinner(false);handleEnd('X0',false);setRedHeartEndOpen(false)}}>{matchDetail.player2.nickname} 赢!</button>
                </div>

        </div>)
    }

    function EndModal(props: { isOpen: boolean }) {//结镖弹窗
        if (!props.isOpen) return null;
        return (
            <div
                className="fixed inset-0 bg-slate-700/50 flex-col items-center justify-center z-50 py-50"
                onClick={() => {
                    setIsEndedOpen(false);
                    !isNowHand ? setP1score((prev) => prev.slice(0, -1)) : setP2score((prev) => prev.slice(0, -1));
                    setIsNowHand(!isNowHand)
                }} // 点击遮罩关闭
            >
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col gap-3 "
                     onClick={(e) => e.stopPropagation()}>
                    <h1 className='mx-auto'>{isWinner ? matchDetail.player1.nickname : matchDetail.player2.nickname}（结镖）</h1>
                    <button className='text-red-500' onClick={() => handleEnd('X1',isWinner)}>1 darts （一镖）</button>
                    <button className='text-red-500' onClick={() => handleEnd('X2',isWinner)}>2 darts （二镖）</button>
                    <button className='text-red-500' onClick={() => handleEnd('X3',isWinner)}>3 darts （三镖）</button>
                </div>
            </div>
        )
    }
    const SettingModal: React.FC<ModalProps> = ({isOpen}) => {//先手设置弹窗
        if (!isOpen) return null;
        return (
            <div
                className="fixed inset-0 bg-slate-500/50 flex-col items-center justify-center z-50 py-50"
                onClick={() => setSettingIsOpen(false)} // 点击遮罩关闭
            >
                <div
                    className="bg-white  shadow-xl w-full max-w-md flex flex-col gap-3 "
                    onClick={(e) => e.stopPropagation()} // 阻止事件冒泡
                >
                    <h1 className="bg-slate-100 text-slate-400 px-2 py-2">选手姓名</h1>
                    <div className="flex  w-full relative">
                        <h2 className='px-3'>选手一:</h2>
                        <span className='underline'>{matchDetail.player1.nickname}</span>
                        <button
                            disabled={settable}
                            className={`relative mb-2 w-21 h-8 ${isFirstHand ? "bg-blue-500" : "bg-slate-400"} rounded-full flex items-center ml-auto mr-2 transition-colors duration-1000 text-white `}
                            onClick={() => {
                                setIsFirstHand(!isFirstHand)
                            }}>
                            <span>{isFirstHand ? '先手' : null}</span>
                            <div
                                className={`w-8 h-8 bg-white rounded-full transition-transform duration-300 ease-in-out ${
                                    isFirstHand ? "translate-x-5" : "translate-x-0"
                                }`}
                            ></div>
                        </button>
                    </div>
                </div>
                <div
                    className="bg-white  shadow-xl w-full max-w-md flex flex-col gap-3 "
                    onClick={(e) => e.stopPropagation()} // 阻止事件冒泡
                >
                    <h1 className="bg-slate-100 text-slate-400 px-2 py-2">选手姓名</h1>
                    <div className="flex  w-full relative">
                        <h2 className='px-3'>选手二:</h2>
                        <span className='underline'>{matchDetail.player2.nickname}</span>
                        <button
                            disabled={settable}
                            className={`relative mb-2 w-21 h-8 ${!isFirstHand ? "bg-blue-500" : "bg-slate-400"} rounded-full flex items-center ml-auto mr-2 transition-colors duration-1000 text-white `}
                            onClick={() => {
                                setIsFirstHand(!isFirstHand)
                            }}>{!isFirstHand ? '先手' : null}
                            <div
                                className={`w-8 h-8 bg-white rounded-full transition-transform duration-300 ease-in-out ${
                                    !isFirstHand ? "translate-x-5" : "translate-x-0"
                                }`}
                            ></div>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    function handleScoreSubmit(score: string) {//处理单次成绩输入
        setRounds(rounds+1)
        setIsStarted(true)
        if (isEnded) throw ('比赛已结束')
        if (isNowHand) {
            if (((p1score.length - 1 === -1) ? Number(startScore) : Number(p1Remaining[p1score.length - 1])) < Number(score)) {
                alert(score)
                alert(p1Remaining)
                alert(p1score.length - 1)
                score = '0'
            }
            if (p1Remaining[p1score.length - 1] === score) {
                setIsEnded(true);
                setIsWinner(true)
                setIsEndedOpen(true)
                setIsStarted(false)
                return
            }
            setP1score((prev) => [...prev, score])

        } else {
            if (((p2score.length - 1 === -1) ? Number(startScore) : Number(p2Remaining[p2score.length - 1])) < Number(score)) {
                score = '0'
            }

            if (p2Remaining[p2score.length - 1] === score) {
                setIsEnded(true);
                setIsWinner(false)
                setIsEndedOpen(true)
                setIsStarted(false)
                return
            }
        setP2score((prev) => [...prev, score])
        }
        if((rounds+1)===limitRounds){setRedHeartEndOpen(true)}
        setIsNowHand(!isNowHand)

    }

    //定时发送比赛数据
        const intervalRef = useRef<NodeJS.Timeout | null>(null);
        // 发送请求的函数
        const sendRequest = async (): Promise<void> => {
            try {
                const requestData: RequestData = {
                    timestamp: Date.now(),
                    data: {status:isEnded,
                    p1score: p1score,
                    p2score: p2score,
                    p1TotalScore: p1TotalScore,
                    p2TotalScore: p2TotalScore,
                        legs:legs,
                        isFirstHand: isFirstHand,
                        startScore: startScore,
                        player1:player1,
                        player2:player2,
                    }
                };

                const response = await fetch(`api/update/?roundId=${roundId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(requestData),
                });

                if (response.ok) {
                    console.log(`请求发送成功`);
                } else {
                    console.error('请求失败:', response.status);
                }
            } catch (error) {
                console.error('请求错误:', error);
            }
        };


        const startRequests = (interval: number = 5000): void => {// 开始定时请求
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }

            // 立即执行第一次请求
            sendRequest();
            // 设置定时器
            intervalRef.current = setInterval(sendRequest, interval);
        };


        const stopRequests = (): void => {// 停止定时请求
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };

        // 组件卸载时清理
        useEffect(() => {
            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            };
        }, []);
    useEffect(() => {
        startRequests(60000);
    }, [isStarted]);

    // ✅ 页面内容
        return (
            <div className="w-full min-h-screen flex flex-col bg-slate-50">
                <div className="flex flex-row justify-center items-center text-center">
                    <div
                        className='bg-blue-400 w-full text-center text-white'>{matchDetail.player1.nickname}({isFirstHand ? '先手' : '后手'})
                    </div>
                    <div className='bg-blue-300 flex w-full items-center justify-center text-white'
                         onClick={() => isStarted ? setSettingIsOpen(true) : null}>
                        <span className='px-5'>轮</span>
                        <img src='/images/setting.png' alt='齿轮图标' className='w-6 h-6 mx-auto'/>
                        <span className='px-5'>先</span>
                    </div>
                    <div
                        className='bg-blue-400 w-full text-center text-white'>{matchDetail.player2.nickname}({isFirstHand ? '后手' : '先手'})
                    </div>
                </div>
                <div className="flex flex-row justify-center  items-stretch">
                    <span className='w-full text-3xl text-bold text-center mr-auto bg-green-300'>{startScore}</span>
                    <span
                        className='w-full text-2xl text-bold text-center bg-green-200'>{p1TotalScore}-{p2TotalScore}</span>
                    <span className='w-full text-3xl text-bold text-center ml-auto bg-green-300'>{startScore}</span>
                </div>
                <table className="min-w-full border border-gray-300 text-center">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-2 py-1 border">{isNowHand ? '持镖' : '未持镖'}</th>
                        <th className="px-2 py-1 border">{startScore}</th>
                        <th className="px-2 py-1 border"></th>
                        <th className="px-2 py-1 border">{isNowHand ? '未持镖' : '持镖'}</th>
                        <th className="px-2 py-1 border">{startScore}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Array.from({length: limitRounds}).map((_, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                            <td className="border px-2 py-1">{p1score[i] ?? '-'}</td>
                            <td className="border px-2 py-1">{p1Remaining[i] ?? '-'}</td>
                            <td className="border px-2 py-1">{i===limitRounds?'':(i + 1) * 3}</td>
                            <td className="border px-2 py-1">{p2score[i] ?? '-'}</td>
                            <td className="border px-2 py-1">{p2Remaining[i] ?? '-'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <NumberPad onSubmit={handleScoreSubmit}/>
                <SettingModal isOpen={isSettingOpen}></SettingModal>
                <EndModal isOpen={isEndedOpen}></EndModal>
                <UploadModal isOpen={isLoading}></UploadModal>
                <RedHeartEndModal isOpen={RedHeartEndOpen}/>
            </div>

        )
    }

export default function JudgePageSus() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <JudgePage />
    </Suspense>
  )
}
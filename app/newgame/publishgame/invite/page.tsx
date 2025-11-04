"use client"
import React, {Suspense} from "react"
import { useState } from "react"
import { useRouter } from 'next/navigation';
import ToMenu from "@/components/ui/to-last-buttom";
import Cookies from "js-cookie";
import {useSearchParams} from "next/navigation";
function PublishGame() {
    const router = useRouter();
    const searchParams = useSearchParams()
    const JudgeCode=searchParams.get("JudgeCode")
    const JoinCode=searchParams.get("JoinCode")
    const [copiedText,setCopiedText] = useState("");
    const [joinToggled,setJoinToggled]=useState(false);
    const [judgeToggled,setJudgeToggled]=useState(false);
    const handleJoinCopy=(code:string) => {
        setCopiedText(code)
        navigator.clipboard.writeText(copiedText)
        setJoinToggled(true)
        setJudgeToggled(false)
    }
    const handleJudgeCopy=(code:string) => {
        setCopiedText(code)
        navigator.clipboard.writeText(copiedText)
        setJudgeToggled(true)
        setJoinToggled(false)
    }
    return (
        <div className="flex flex-col gap-5 p-1 min-h-screen bg-slate-50 ">
            <div className=" relative flex flex-row py-5 h-20 items-center justify-center ">
                <ToMenu/>
                <p className="font-bold w-full text-3xl text-center">dartsn01</p>
            </div>
            <div className="border rounded-2xl flex flex-col gap-3 p-5">
                <label htmlFor="JoinCode">参赛码</label>
                <div className="relative flex flex-row gap-5">
                    <input disabled id="JoinCode" className="text-2xl text-blue-600 border-0 border-b-2 border-dashed border-gray-300  font-bold w-40 " type="text" defaultValue={JoinCode ?? ''} />
                    <button onClick={ ()=>{handleJoinCopy(JoinCode??'')}} className="border rounded-xl px-5 bg-blue-500 text-white">{joinToggled ? '已复制到剪切板' : '点击复制'} </button>
                </div>
                <label htmlFor="JudgeinCode">裁判码</label>
                <div className="relative flex flex-row gap-5">
                    <input disabled id="JudgeCode" className="text-2xl text-pink-600 border-0 border-b-2 border-dashed border-gray-300 font-bold w-40" type="text" defaultValue={JudgeCode ?? ''} />
                    <button onClick={()=>{handleJudgeCopy(JudgeCode??'')}} className="border rounded-xl px-5 bg-pink-500 text-white">{judgeToggled ? '已复制到剪切板' : '点击复制'}</button>
                </div>
            </div>
            <div className="border rounded-2xl flex flex-col gap-3 p-5 border-green-300 bg-green-100 text-green-600">
                成功创建比赛，已为您生成参赛码和裁判码,快去邀请吧！
            </div>
        </div>




    )
}
export default function PublishGamePage(){
    return (
        <Suspense>
            <PublishGame/>
        </Suspense>
    )
}
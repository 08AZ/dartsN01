"use client"
import type React from "react"
import { useState } from "react"
import Cookie from "js-cookie";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import ToMenu from "../../components/ui/to-last-buttom"
export default function newgame(){
    return (<div className='min-h-screen bg-gradient-to-br from-slate-50 via-pink-100 to-slate-50'>
            <ToMenu/>
            <div className="flex flex-col  py-10 gap-y-5  text-center ">
                <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4'>{'新的比赛'}</h1>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">发布或参加比赛</h2>
            </div>

        <div className="flex flex-col gap-4 p-5">
            <a href="./newgame/publishgame" className="flex flex-col w-full h-30 shadow-lg rounded-lg bg-gradient-to-br from-slate-50 via-red-200 to-slate-50  mb-4">
                    <div className="h-20 w-full overflow-hidden relative  ">
                        <Image
                         src={"/images/publish.png"}
                         alt={"publishGame"}
                         fill
                         className="object-contain"
                     />
                    </div>
                    <div className="relative">
                        <p  className="text-2xl text-center ">
                            发布比赛
                        </p>
                    </div>
            </a>
            <a href={"./newgame/joiningame"} className="flex flex-col relative w-full h-30 shadow-lg  rounded-lg bg-gradient-to-br from-slate-50 via-blue-200 to-slate-50">

                    <div className="relative h-68 w-full overflow-hidden  ">
                        <Image
                         src={"/images/trophy.png"}
                         alt={"publishGame"}
                         fill
                         className="object-contain"
                     />
                    </div>
                    <div>
                        <p  className="text-2xl text-center  ">
                            参加比赛
                        </p>
                    </div>
            </a>
            <a href={"./newgame/judgegame"} className="flex relative flex-col w-full h-30 shadow-lg  rounded-lg bg-gradient-to-br from-slate-50 via-green-300 to-slate-50">
                    <div className="relative h-68 w-full overflow-hidden ">
                        <Image
                         src={"/images/judge.png"}
                         alt={"publishGame"}
                         fill
                         className="object-contain"
                     />
                    </div>
                    <div>
                        <p  className="text-2xl text-center  ">
                            裁判比赛
                        </p>
                    </div>
            </a>
        </div>

    </div>

    )
}
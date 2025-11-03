"use client"
import type React from "react"
import { useState } from "react"
import Cookie from "js-cookie";
import { useRouter } from 'next/navigation';

export default function PublishForm(){
    const router = useRouter();

    const handlePublish = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // 阻止表单默认提交行为
        const formData = new FormData(e.currentTarget);
        try {
            const res = await fetch("/api/publishGame", {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            });

            if (res.ok) {
                const data = await res.json();
                console.log("发布成功:", data);
                router.push("/invite",{});
            } else {
                console.error("发布失败:", res.status);
            }
        } catch (error) {
            console.error("请求错误:", error);
        }
    }

    return (
        <>
            <div>
                <form onSubmit={handlePublish} className="flex flex-col y-10 gap-y-5 text-3xl">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="matchName">比赛名称</label>
                        <input
                            id="matchName"
                            type="text"
                            name="matchName"
                            required
                            className="border w-90"
                        />
                    </div>
                    <hr className="border-blue-300" />
                    <div className="flex flex-col gap-2">
                        <label htmlFor="playerNum">比赛人数</label>
                        <input
                            id="playerNum"
                            name="playerNum"
                            type="number"
                            required
                            className="border w-90"
                        />
                    </div>
                    <hr className="border-blue-300" />
                    <div className="flex flex-col gap-2">
                        <label>比赛分数(默认使用301)</label>
                        <input
                        name="startScore"
                        type="number"
                        required
                        defaultValue={301}
                        placeholder="默认使用301"
                        className="border w-90"/>
                    </div>
                        <hr className="border-blue-300" />
                        <div className="flex flex-col gap-2">
                            <label>比赛赛制(默认使用BO3)</label>
                        <input
                        name="bestOf"
                        type="text"
                        required
                        placeholder="默认使用BO3"
                        defaultValue={"BO3"}
                        className="border w-90 placeholder:text-gray-500 focus:text-gray-900"/>
                        </div>
                        <hr className="border-blue-300" />
                        <div className="flex flex-col gap-2">
                            <label>单局轮次(默认不限制轮数)</label>
                        <input
                        name="limitRounds"
                        type="number"
                        placeholder="默认不限制轮数"
                        defaultValue={999}
                        className="border w-90 placeholder:text-gray-500 focus:text-gray-900"
                        />
                        </div>
                </form>
            </div>
        </>
    )
}
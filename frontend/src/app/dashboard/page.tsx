"use client"

import TodoCard from "@/components/TodoCard/TodoCard";
import { useIsUserLoggedIn } from "@/lib/hooks";
import { userDetails } from "@/lib/recoil/atoms";
import { useRecoilValue } from "recoil";

const Page = () => {
    useIsUserLoggedIn()
    const user = useRecoilValue(userDetails)
    return(
        <>
        <h1 className="text-center text-2xl my-4 font-bold">Welcome {user.user.name}</h1>
        <h2 className="text-center text-xl my-4 font-bold">Here are your todos</h2>
         <div className="flex w-full justify-center flex-wrap">
            <div className="w-full sm:w-1/2 p-2">
                <TodoCard/>
            </div>
            <div className="w-full sm:w-1/2 p-2">
                <TodoCard/>
            </div>
            <div className="w-full sm:w-1/2 p-2">
                <TodoCard/>
            </div>
            <div className="w-full sm:w-1/2 p-2">
                <TodoCard/>
            </div>
            <div className="w-full sm:w-1/2 p-2">
                <TodoCard/>
            </div>
            <div className="w-full sm:w-1/2 p-2">
                <TodoCard/>
            </div>
            <div className="w-full sm:w-1/2 p-2">
                <TodoCard/>
            </div>
            <div className="w-full sm:w-1/2 p-2">
                <TodoCard/>
            </div>
            <div className="w-full sm:w-1/2 p-2">
                <TodoCard/>
            </div>
            <div className="w-full sm:w-1/2 p-2">
                <TodoCard/>
            </div>
            <div className="w-full sm:w-1/2 p-2">
                <TodoCard/>
            </div>
            <div className="w-full sm:w-1/2 p-2">
                <TodoCard/>
            </div>
            <div className="w-full sm:w-1/2 p-2">
                <TodoCard/>
            </div>
          
        </div>
        </>
       
    )
};

export default Page;

"use client";

import TodoCard from "@/components/TodoCard/TodoCard";
import { useIsUserLoggedIn } from "@/lib/hooks";
import { userDetails } from "@/lib/recoil/atoms";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { BACKEND_URL } from "../../../config";
import axios from "axios";

const Page = () => {
    useIsUserLoggedIn();
    const user = useRecoilValue(userDetails);
    const [todos, setTodos] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/todo/get`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setTodos(response.data.data.todos);
            } catch (error: any) {}
        })();
    }, [user]);
    

    return (
        <>
            <h1 className="text-center text-2xl my-4 font-bold">
                Welcome {user.user.name}
            </h1>
            <h2 className="text-center text-xl my-4 font-bold">
                Here are your todos
            </h2>
            <div className="flex w-full justify-center flex-wrap">
                {todos.map(
                    (todo) =>
                        todo.isPinned && (
                            <div
                                key={todo._id}
                                className="w-full sm:w-1/2 p-2 md:w-1/3"
                            >
                                <TodoCard todo={todo} />
                            </div>
                        )
                )}
                {todos.map(
                    (todo) =>
                        !todo.isPinned && (
                            <div
                                key={todo._id}
                                className="w-full sm:w-1/2 p-2 md:w-1/3"
                            >
                                <TodoCard todo={todo} />
                            </div>
                        )
                )}
            </div>
        </>
    );
};

export default Page;

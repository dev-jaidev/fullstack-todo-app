"use client";

import TodoCard from "@/components/TodoCard/TodoCard";
import { useIsUserLoggedIn } from "@/lib/hooks";
import {
    Folder,
    foldersAtom,
    todosAtom,
    userDetails,
} from "@/lib/recoil/atoms";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { BACKEND_URL } from "../../../config";
import axios from "axios";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TbAdjustmentsHorizontal, TbTruckLoading } from "react-icons/tb";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { HiOutlineMenu } from "react-icons/hi";
import CreateFolderPopUP from "@/components/CreateFolderPopUp";
import { AiOutlineLoading } from "react-icons/ai";
import { ContextMenu } from "@radix-ui/react-context-menu";
import {
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { toast } from "sonner";
import AreYouSure from "@/components/AreYouSure";

const Page = () => {
    useIsUserLoggedIn();
    const user = useRecoilValue(userDetails);
    const [folders, setFolders] = useRecoilState(foldersAtom);
    const [todos, setTodos] = useRecoilState(todosAtom);
    const [isLoading, setIsLoading] = useState(true);
    const [currentFolder, setcurrentFolder] = useState<Folder>({
        name: "All",
        _id: "",
    });
    const pressTimer = useRef<NodeJS.Timeout | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        pressTimer.current = setTimeout(() => {
            e.target.dispatchEvent(
                new MouseEvent("contextmenu", { bubbles: true })
            );
        }, 1000);
    };

    const handleTouchEnd = () => {
        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(`${BACKEND_URL}/folder/get`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setFolders(res.data.data.folders);
            } catch (err: any) {
                console.log(err);
            }
        })();
    }, [setFolders, setTodos, user]);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${BACKEND_URL}/todo/get`, {
                    params: {
                        parent: currentFolder._id,
                    },
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setTodos(response.data.data.todos);
            } catch (error: any) {
                setTodos([]);
            }
            setIsLoading(false);
        })();
    }, [setTodos, user.token, currentFolder]);

    return (
        <>
            <div className="w-full flex justify-between p-2">
                <h1 className="text-center text-2xl my-4 font-bold">
                    Welcome {user.user.name}
                </h1>
                <DropdownMenu>
                    <DropdownMenuTrigger className="p-0">
                        <HiOutlineMenu size={30} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="absolute right-0 w-40">
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <CreateFolderPopUP>
                                    <span
                                        className={`justify-start items-center text-sm gap-2 flex p-2 hover:bg-accent hover:cursor-pointer`}
                                    >
                                        <PlusCircledIcon /> Create Folder
                                    </span>
                                </CreateFolderPopUP>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <span className="justify-start items-center text-sm gap-2 flex p-3 hover:bg-accent hover:cursor-pointer">
                                    <TbAdjustmentsHorizontal /> Filters
                                </span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div>
                {folders.length > 0 && (
                    <ul
                        className={
                            "flex gap-3 overflow-x-scroll border-b-[1px] border-accent pb-0.5 no-scrollbar mx-2 select-none"
                        }
                    >
                        <li
                            className={buttonVariants({
                                variant: "ghost",
                                className: `${
                                    currentFolder._id === "" &&
                                    " border-white bg-accent"
                                } hover:cursor-pointer rounded-b-none border-b-2 border-transparent`,
                            })}
                            onClick={() =>
                                setcurrentFolder({ name: "All", _id: "" })
                            }
                        >
                            All
                        </li>
                        {folders.map((folder) => (
                            <ContextMenu key={folder._id}>
                                <ContextMenuTrigger
                                    asChild
                                    onTouchStart={handleTouchStart}
                                    onTouchEnd={handleTouchEnd}
                                >
                                    <li
                                        className={buttonVariants({
                                            variant: "ghost",
                                            className: `${
                                                currentFolder._id ===
                                                    folder._id &&
                                                " border-white bg-accent"
                                            } hover:cursor-pointer rounded-b-none border-b-2 border-transparent`,
                                        })}
                                        onClick={() => setcurrentFolder(folder)}
                                    >
                                        {folder.name}
                                    </li>
                                </ContextMenuTrigger>
                                <ContextMenuContent className="w-20">
                                    <ContextMenuItem asChild>
                                        <CreateFolderPopUP folder={folder}>
                                            <Button
                                                variant="ghost"
                                                className="p-1.5 w-full justify-start"
                                            >
                                                Edit
                                            </Button>
                                        </CreateFolderPopUP>
                                    </ContextMenuItem>
                                    <ContextMenuItem asChild>
                                        <AreYouSure
                                            message="Are you sure you want to delete this folder? All the todos in this folder will be deleted too."
                                            func={async () => {
                                                try {
                                                    const res =
                                                        await axios.delete(
                                                            `${BACKEND_URL}/folder/delete?id=${folder._id}`,
                                                            {
                                                                headers: {
                                                                    Authorization: `Bearer ${user.token}`,
                                                                },
                                                            }
                                                        );
                                                    setFolders((prev) =>
                                                        prev.filter(
                                                            (f) =>
                                                                f._id !==
                                                                folder._id
                                                        )
                                                    );
                                                    if (
                                                        currentFolder._id ===
                                                        folder._id
                                                    ) {
                                                        setcurrentFolder({
                                                            name: "All",
                                                            _id: "",
                                                        });
                                                    }
                                                    toast(res.data.message);
                                                } catch (error: any) {
                                                    toast(
                                                        error.response.data
                                                            .message
                                                    );
                                                }
                                            }}
                                        >
                                            <Button
                                                variant="ghost"
                                                className="p-1.5 w-full justify-start"
                                            >
                                                Delete
                                            </Button>
                                        </AreYouSure>
                                    </ContextMenuItem>
                                </ContextMenuContent>
                            </ContextMenu>
                        ))}
                    </ul>
                )}
            </div>

            {isLoading ? (
                <div className="text-center w-full h-[70vh] items-center justify-center flex">
                    <AiOutlineLoading className="animate-spin" size={30} />
                </div>
            ) : todos.length ? (
                <div className="flex w-full justify-start flex-wrap">
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
            ) : (
                <div className="text-center w-full h-[70vh] items-center justify-center flex">
                    No Todos Found
                </div>
            )}
        </>
    );
};

export default Page;

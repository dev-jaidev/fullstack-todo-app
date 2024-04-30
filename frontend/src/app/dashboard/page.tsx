"use client";

import TodoCard from "@/components/TodoCard/TodoCard";
import { useIsUserLoggedIn } from "@/lib/hooks";
import {
    Folder,
    foldersAtom,
    Tag,
    tagsAtom,
    todosAtom,
    userDetails,
} from "@/lib/recoil/atoms";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { BACKEND_URL } from "../../../config";
import axios from "axios";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
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
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import {
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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
    const [tags, setTags] = useRecoilState(tagsAtom);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    interface Filters {
        tags?: string;
        sortbytime?: "older" | "newer";
        sortbypriority?: "low" | "medium" | "high";
        iscompeleted?: "true" | "false";
        sortbyduedate?: "earlier" | "later";
    }
    const [filters, setFilters] = useState<Filters>({});

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
            try {
                const res = await axios.get(`${BACKEND_URL}/todo/tags`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setTags(res.data.data.tags);
            } catch (error) {}
        })();
    }, [setTags, user]);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${BACKEND_URL}/todo/get`, {
                    params: {
                        parent: currentFolder._id,
                        ...filters,
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
    }, [setTodos, user.token, currentFolder, filters]);

    useEffect(() => {
        if (selectedTags.length) {
            setFilters((prev) => ({
                ...prev,
                tags: selectedTags.join(","),
            }));
        } else {
            const newFilters = { ...filters };
            delete newFilters.tags;
            setFilters(newFilters);
        }
    }, [selectedTags]);

    return (
        <>
            <div className="w-full flex justify-between p-2">
                <h1 className="text-center text-lg md:text-2xl my-4 font-bold">
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
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <span className="justify-start items-center text-sm gap-2 flex p-2 hover:bg-accent hover:cursor-pointer">
                                            <TbAdjustmentsHorizontal /> Filters
                                        </span>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[600px]">
                                        <DialogHeader>
                                            <DialogTitle>Filters</DialogTitle>
                                        </DialogHeader>
                                        <div className="flex justify-around items-center flex-col md:flex-row [&>*]:w-full gap-3 md:[&>*]:w-1/3">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline">
                                                    Filter By Tags
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-56">
                                                <DropdownMenuLabel>
                                                    Tags
                                                </DropdownMenuLabel>
                                                <DropdownMenuCheckboxItem
                                                    checked={
                                                        !selectedTags.length
                                                    }
                                                    onCheckedChange={(
                                                        checked
                                                    ) => {
                                                        if (checked) {
                                                            setSelectedTags([]);
                                                        }
                                                    }}
                                                >
                                                    All
                                                </DropdownMenuCheckboxItem>
                                                {tags.map((tag: Tag) => (
                                                    <DropdownMenuCheckboxItem
                                                        key={tag._id}
                                                        checked={selectedTags.includes(
                                                            tag._id
                                                        )}
                                                        onCheckedChange={(
                                                            checked
                                                        ) => {
                                                            checked
                                                                ? setSelectedTags(
                                                                      [
                                                                          ...selectedTags,
                                                                          tag._id,
                                                                      ]
                                                                  )
                                                                : setSelectedTags(
                                                                      selectedTags.filter(
                                                                          (t) =>
                                                                              t !==
                                                                              tag._id
                                                                      )
                                                                  );
                                                        }}
                                                    >
                                                        {tag._id}
                                                    </DropdownMenuCheckboxItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline">
                                                    Filter By Status
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-56">
                                                <DropdownMenuLabel>
                                                    Status
                                                </DropdownMenuLabel>

                                                <DropdownMenuCheckboxItem
                                                    checked={
                                                        !filters.iscompeleted
                                                    }
                                                    onCheckedChange={(
                                                        checked
                                                    ) => {
                                                        if (checked) {
                                                            const newFilters = {
                                                                ...filters,
                                                            };
                                                            delete newFilters.iscompeleted;
                                                            setFilters(
                                                                newFilters
                                                            );
                                                        }
                                                    }}
                                                >
                                                    All
                                                </DropdownMenuCheckboxItem>
                                                <DropdownMenuCheckboxItem
                                                    checked={
                                                        filters.iscompeleted ===
                                                        "true"
                                                    }
                                                    onCheckedChange={(
                                                        checked
                                                    ) => {
                                                        if (checked) {
                                                            setFilters({
                                                                ...filters,
                                                                iscompeleted:
                                                                    "true",
                                                            });
                                                        } else {
                                                            const newFilters = {
                                                                ...filters,
                                                            };
                                                            delete newFilters.iscompeleted;
                                                            setFilters(
                                                                newFilters
                                                            );
                                                        }
                                                    }}
                                                >
                                                    Show Completed
                                                </DropdownMenuCheckboxItem>
                                                <DropdownMenuCheckboxItem
                                                    checked={
                                                        filters.iscompeleted ===
                                                        "false"
                                                    }
                                                    onCheckedChange={(
                                                        checked
                                                    ) => {
                                                        if (checked) {
                                                            setFilters({
                                                                ...filters,
                                                                iscompeleted:
                                                                    "false",
                                                            });
                                                        } else {
                                                            const newFilters = {
                                                                ...filters,
                                                            };
                                                            delete newFilters.iscompeleted;
                                                            setFilters(
                                                                newFilters
                                                            );
                                                        }
                                                    }}
                                                >
                                                    Show uncomplete
                                                </DropdownMenuCheckboxItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline">
                                                    Sort By
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-56">
                                                <DropdownMenuLabel>
                                                    Sort
                                                </DropdownMenuLabel>

                                                <DropdownMenuCheckboxItem
                                                    checked={
                                                        !filters.sortbytime &&
                                                        !filters.sortbypriority &&
                                                        !filters.sortbyduedate
                                                    }
                                                    onCheckedChange={(
                                                        checked
                                                    ) => {
                                                        if (checked) {
                                                            const newFilters = {
                                                                ...filters,
                                                            };
                                                            delete newFilters.sortbypriority;
                                                            delete newFilters.sortbytime;
                                                            delete newFilters.sortbyduedate;
                                                            setFilters(
                                                                newFilters
                                                            );
                                                        }
                                                    }}
                                                >
                                                    Sort By Time: Newer
                                                </DropdownMenuCheckboxItem>
                                                <DropdownMenuCheckboxItem
                                                    checked={
                                                        filters.sortbytime ===
                                                        "older"
                                                    }
                                                    onCheckedChange={(
                                                        checked
                                                    ) => {
                                                        if (checked) {
                                                            const newFilters = {
                                                                ...filters,
                                                            };
                                                            delete newFilters.sortbypriority;
                                                            delete newFilters.sortbyduedate;
                                                            delete newFilters.sortbytime;
                                                            setFilters({
                                                                ...newFilters,
                                                                sortbytime:
                                                                    "older",
                                                            });
                                                        } else {
                                                            const newFilters = {
                                                                ...filters,
                                                            };
                                                            delete newFilters.sortbypriority;
                                                            delete newFilters.sortbytime;
                                                            delete newFilters.sortbyduedate;
                                                            setFilters(
                                                                newFilters
                                                            );
                                                        }
                                                    }}
                                                >
                                                    Sort By Time: Older
                                                </DropdownMenuCheckboxItem>
                                                <DropdownMenuCheckboxItem
                                                    checked={
                                                        filters.sortbypriority ===
                                                        "high"
                                                    }
                                                    onCheckedChange={(
                                                        checked
                                                    ) => {
                                                        if (checked) {
                                                            const newFilters = {
                                                                ...filters,
                                                            };
                                                            delete newFilters.sortbypriority;
                                                            delete newFilters.sortbyduedate;
                                                            delete newFilters.sortbytime;
                                                            setFilters({
                                                                ...newFilters,
                                                                sortbypriority:
                                                                    "high",
                                                            });
                                                        } else {
                                                            const newFilters = {
                                                                ...filters,
                                                            };
                                                            delete newFilters.sortbypriority;
                                                            delete newFilters.sortbytime;
                                                            delete newFilters.sortbyduedate;
                                                            setFilters(
                                                                newFilters
                                                            );
                                                        }
                                                    }}
                                                >
                                                    Priority: High
                                                </DropdownMenuCheckboxItem>
                                                <DropdownMenuCheckboxItem
                                                    checked={
                                                        filters.sortbypriority ===
                                                        "low"
                                                    }
                                                    onCheckedChange={(
                                                        checked
                                                    ) => {
                                                        if (checked) {
                                                            const newFilters = {
                                                                ...filters,
                                                            };
                                                            delete newFilters.sortbypriority;
                                                            delete newFilters.sortbyduedate;
                                                            delete newFilters.sortbytime;
                                                            setFilters({
                                                                ...newFilters,
                                                                sortbypriority:
                                                                    "low",
                                                            });
                                                        } else {
                                                            const newFilters = {
                                                                ...filters,
                                                            };
                                                            delete newFilters.sortbypriority;
                                                            delete newFilters.sortbytime;
                                                            delete newFilters.sortbyduedate;
                                                            setFilters(
                                                                newFilters
                                                            );
                                                        }
                                                    }}
                                                >
                                                    Priority: Low
                                                </DropdownMenuCheckboxItem>
                                                <DropdownMenuCheckboxItem
                                                    checked={
                                                        filters.sortbyduedate ===
                                                        "earlier"
                                                    }
                                                    onCheckedChange={(
                                                        checked
                                                    ) => {
                                                        if (checked) {
                                                            const newFilters = {
                                                                ...filters,
                                                            };
                                                            delete newFilters.sortbypriority;
                                                            delete newFilters.sortbyduedate;
                                                            delete newFilters.sortbytime;
                                                            setFilters({
                                                                ...newFilters,
                                                                sortbyduedate:
                                                                    "earlier",
                                                            });
                                                        } else {
                                                            const newFilters = {
                                                                ...filters,
                                                            };
                                                            delete newFilters.sortbypriority;
                                                            delete newFilters.sortbytime;
                                                            delete newFilters.sortbyduedate;
                                                            setFilters(
                                                                newFilters
                                                            );
                                                        }
                                                    }}
                                                >
                                                    Due Date: Earlier
                                                </DropdownMenuCheckboxItem>
                                                <DropdownMenuCheckboxItem
                                                    checked={
                                                        filters.sortbyduedate ===
                                                        "later"
                                                    }
                                                    onCheckedChange={(
                                                        checked
                                                    ) => {
                                                        if (checked) {
                                                            const newFilters = {
                                                                ...filters,
                                                            };
                                                            delete newFilters.sortbypriority;
                                                            delete newFilters.sortbyduedate;
                                                            delete newFilters.sortbytime;
                                                            setFilters({
                                                                ...newFilters,
                                                                sortbyduedate:
                                                                    "later",
                                                            });
                                                        } else {
                                                            const newFilters = {
                                                                ...filters,
                                                            };
                                                            delete newFilters.sortbypriority;
                                                            delete newFilters.sortbytime;
                                                            delete newFilters.sortbyduedate;
                                                            setFilters(
                                                                newFilters
                                                            );
                                                        }
                                                    }}
                                                >
                                                    Due Date: Later
                                                </DropdownMenuCheckboxItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        </div>
                                    </DialogContent>
                                </Dialog>
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

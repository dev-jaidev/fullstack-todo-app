"use client";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../../config";
import { useRecoilValue } from "recoil";
import { userDetails } from "@/lib/recoil/atoms";
import { Input } from "../ui/input";
import { CrossCircledIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { UseFormSetValue } from "react-hook-form";

export default function Tags({
    setFormValue,
    defaulTags,
}: {
    setFormValue: UseFormSetValue<{
        title: string;
        priority: "1" | "2" | "3";
        tags: string[];
        description?: string | undefined;
        parent?: string | undefined;
        dueDate?: Date | undefined;
    }>;
    defaulTags: string[];
}) {
    const userDetail = useRecoilValue(userDetails);
    const [existingTags, setExistingTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const ref = useRef<HTMLInputElement>(null);

    const [tags, setTags] = useState<string[]>(defaulTags);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(`${BACKEND_URL}/todo/tags`, {
                    headers: {
                        Authorization: `Bearer ${userDetail.token}`,
                    },
                });
                setExistingTags(res.data.data.tags);
            } catch (error) {}
        })();
    }, [userDetail.token]);

    useEffect(() => {
        setFormValue("tags", tags);
    }, [setFormValue, tags]);

    return (
        <div className="flex w-full flex-col items-start justify-between rounded-md border px-4 py-1.5 sm:flex-row sm:items-center">
            <p className="text-sm font-medium leading-none flex flex-wrap gap-1">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="bg-primary px-2 text-xs text-primary-foreground items-center flex py-1 gap-1 rounded-full"
                    >
                        {tag}
                        <CrossCircledIcon
                            className="h-4 w-4 cursor-pointer hover:text-red-500"
                            onClick={() => {
                                setTags(tags.filter((t) => t !== tag));
                            }}
                        />
                    </span>
                ))}
            </p>
            <DropdownMenu
                open={open}
                onOpenChange={(isOpen) => {
                    setOpen(isOpen);
                    if (isOpen) {
                        setTimeout(() => {
                            ref.current?.focus();
                        }, 200);
                    }
                }}
            >
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                        <PlusCircledIcon className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuGroup>
                        <Command>
                            <Input
                                className="!ring-0 border-none !border-b-slate-50"
                                placeholder="Enter Tag Name"
                                autoFocus={true}
                                ref={ref}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (
                                        (e.key === "Enter" || e.key === ",") &&
                                        inputValue !== ""
                                    ) {
                                        if (e.key === ",") {
                                            e.preventDefault();
                                        }
                                        if (!tags.includes(inputValue)) {
                                            setTags([...tags, inputValue]);
                                            setInputValue("");
                                        }
                                    }
                                }}
                            ></Input>
                            <div className="hidden">
                                <CommandInput value={inputValue} />
                            </div>

                            <CommandList>
                                <CommandGroup>
                                    {existingTags.map(
                                        (tag: any) =>
                                            !tags.includes(tag._id) && (
                                                <CommandItem
                                                    key={tag._id}
                                                    value={tag._id}
                                                    onSelect={(value) => {
                                                        setTags([
                                                            ...tags,
                                                            value,
                                                        ]);
                                                    }}
                                                >
                                                    {tag._id}
                                                </CommandItem>
                                            )
                                    )}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

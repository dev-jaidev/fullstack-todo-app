"use client";
import { Menubar, MenubarMenu } from "@/components/ui/menubar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";


import { Button } from "../ui/button";
import { IoIosLogOut, IoMdAdd } from "react-icons/io";
import ThemeSwitcher from "./theme-switcher";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRecoilValue } from "recoil";
import { userDetails } from "@/lib/recoil/atoms";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Account from "./Account";
import TodoForm from "../TodoForm/TodoForm";

const Nav = () => {
    const router = useRouter();
    const pathname = usePathname();
    const userDetail = useRecoilValue(userDetails);

    return pathname === "/dashboard" ? (
        <div className="container max-w-[33rem] fixed bottom-3 left-0 right-0 pr-2 pl-2">
            <Menubar className="h-auto py-2 px-4 gap-4 justify-center bg-green-500 dark:bg-green-300 !bg-opacity-50 rounded-full">
                <TooltipProvider>
                    <MenubarMenu>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <ThemeSwitcher />
                            </TooltipTrigger>
                            <TooltipContent>
                                <span className="font-bold">Theme</span>
                            </TooltipContent>
                        </Tooltip>
                    </MenubarMenu>

                    <MenubarMenu>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <TodoForm>
                                <Button
                                    variant={"outline"}
                                    className="p-2 h-auto w-auto bg-transparent hover:bg-green-600 hover:text-white border-none rounded-xl"
                                    size={"icon"}
                                >
                                    <IoMdAdd className="sm:h-[1.7rem] sm:w-[1.7rem] h-[1.5rem] w-[1.5rem]" />
                                </Button>
                                </TodoForm>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span className="font-bold">Add TODO</span>
                            </TooltipContent>
                        </Tooltip>
                    </MenubarMenu>

                    <MenubarMenu>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Account>
                                <Button
                                    variant={"outline"}
                                    className="p-2 h-auto w-auto bg-transparent hover:bg-green-600 hover:text-white border-none rounded-xl"
                                    size={"icon"}
                                >
                                        <Avatar className="sm:h-[1.7rem] sm:w-[1.7rem] h-[1.5rem] w-[1.5rem]">
                                        <AvatarImage src={userDetail.user.avatar} alt="Avatar"/>
                                        <AvatarFallback>{userDetail.user.name.split("")[0]}</AvatarFallback>
                                      </Avatar>
                                </Button>
                                </Account>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span className="font-bold">Account</span>
                            </TooltipContent>
                        </Tooltip>
                    </MenubarMenu>

                    <MenubarMenu>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className="p-2 h-auto w-auto bg-transparent hover:bg-green-600 hover:text-white border-none rounded-xl"
                                    size={"icon"}
                                    onClick={() => {
                                        localStorage.removeItem("accessToken");
                                        router.push("/login");
                                        toast("Logged out successfully");
                                    }}
                                >
                                    <IoIosLogOut className="sm:h-[1.7rem] sm:w-[1.7rem] h-[1.5rem] w-[1.5rem]" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span className="font-bold">Logout</span>
                            </TooltipContent>
                        </Tooltip>
                    </MenubarMenu>
                </TooltipProvider>
            </Menubar>
        </div>
    ) : null;
};

export default Nav;

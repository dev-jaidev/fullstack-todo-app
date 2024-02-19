import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/ui/menubar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";


import { AvatarIcon, DashboardIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import Link from "next/link";
import { IoIosLogOut, IoMdAdd } from "react-icons/io";
import dynamic from "next/dynamic";
import ThemeSwitcher from "./theme-switcher";

const Nav = () => {
    return (
      <div className="container max-w-[33rem] fixed bottom-3 left-0 right-0">
                <Menubar className="h-auto py-2 px-4 gap-4 justify-center bg-green-500 dark:bg-green-300 !bg-opacity-50 rounded-full">
              <TooltipProvider>
                    <MenubarMenu>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href={"/dashboard"}>
                                    <Button
                                        variant={"outline"}
                                        className="p-2 h-auto w-auto bg-transparent hover:bg-green-600 hover:text-white border-none rounded-xl"
                                        size={"icon"}
                                    >
                                        <DashboardIcon className="h-[1.7rem] w-[1.7rem]" />
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span className="font-bold">Dashboard</span>
                            </TooltipContent>
                        </Tooltip>
                    </MenubarMenu>

                    <MenubarMenu>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <ThemeSwitcher/> 
                            </TooltipTrigger>
                            <TooltipContent>
                                <span className="font-bold">Theme</span>
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
                                >
                                    <IoMdAdd className="h-[1.7rem] w-[1.7rem]" />
                                </Button>

                            </TooltipTrigger>
                            <TooltipContent>
                                <span className="font-bold">Add TODO</span>
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
                                >
                                    <AvatarIcon className="h-[1.7rem] w-[1.7rem]" />
                                </Button>
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
                                >
                                    <IoIosLogOut className="h-[1.7rem] w-[1.7rem]" />
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
    );
};

export default Nav;

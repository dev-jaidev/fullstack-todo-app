import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { RiPushpinFill } from "react-icons/ri";
import { flushSync } from "react-dom";
import TodoDropDownMenu from "./TodoMenu";
import TodoPopUp from "./TodoPopUp";

export default function TodoCard() {
    return (
        <Card className="relative w-full">
            <RiPushpinFill className="w-5 h-5 absolute left-1 top-1 rounded-full -scale-x-[1]" />
            <span className="absolute right-1 top-1 rounded-xl">
                <TodoDropDownMenu />
            </span>
            <TodoPopUp>
                <div className="hover:cursor-pointer">
                    <CardHeader className="mt-4 pb-4">
                        <CardTitle className="text-xl">
                            Create project
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground pb-8">
                        Deploy your new project in one-click.
                    </CardContent>
                </div>
            </TodoPopUp>
            <CardFooter className="flex-col pb-10">
                <span
                    className={`text-sm text-muted-foreground w-full ${
                        false ? "text-primary" : "text-red-500"
                    }`}
                >
                    Due Date: 12 August 2023
                </span>
                <div className="flex gap-2 mt-3 w-full flex-wrap">
                    <Badge variant={"outline"}>New</Badge>
                    <Badge variant={"outline"}>New</Badge>
                    <Badge variant={"outline"}>New</Badge>
                    <Badge variant={"outline"}>New</Badge>
                    <Badge variant={"outline"}>New</Badge>
                </div>
            </CardFooter>
            <Badge
                className="absolute right-1 bottom-1 rounded-xl"
                variant={false ? "default" : "destructive"}
            >
                Pending
            </Badge>
        </Card>
    );
}

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { RiPushpinFill } from "react-icons/ri";
import TodoDropDownMenu from "./TodoMenu";
import TodoPopUp from "./TodoPopUp";
import { BACKEND_URL } from "../../../config";
import axios from "axios";
import { todosAtom, userDetails } from "@/lib/recoil/atoms";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { toast } from "sonner";

export default function TodoCard({ todo }: { todo: any }) {
    const setTodos = useSetRecoilState(todosAtom);
    const user = useRecoilValue(userDetails);
    const toggelPin = async () => {
        try {
            console.log(user.token);
            const res = await axios.put(
                `${BACKEND_URL}/todo/pin?id=${todo._id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            toast(res.data.message);
            setTodos((prev) =>
                [...prev].map((t) =>
                    t._id === todo._id ? { ...t, isPinned: !t.isPinned } : t
                )
            );
        } catch (error: any) {
            toast(error.response.data.message);
        }
    };

    const deleteTodo = async () => {
        try {
            console.log(user.token);
            const res = await axios.delete(
                `${BACKEND_URL}/todo/delete?id=${todo._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            toast(res.data.message);
            setTodos((prev) => prev.filter((t) => t._id !== todo._id));
        } catch (error: any) {
            toast(error.response.data.message);
        }
    };
    const toggleIsCompleted = async () => {
        try {
            const res = await axios.put(
                `${BACKEND_URL}/todo/toggle?id=${todo._id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            toast(res.data.message);
            setTodos((prev) =>
                [...prev].map((t) =>
                    t._id === todo._id
                        ? { ...t, isCompleted: !t.isCompleted }
                        : t
                )
            );
        } catch (error: any) {
            toast(error.response.data.message);
        }
    };

    return (
        <Card className="relative w-full h-full">
            {todo.isPinned && (
                <RiPushpinFill className="w-5 h-5 absolute left-1 top-1 rounded-full -scale-x-[1]" />
            )}
            <span className="absolute right-1 top-1 rounded-xl">
                <TodoDropDownMenu
                    todo={todo}
                    togglePin={toggelPin}
                    deleteTodo={deleteTodo}
                    toggleIsCompleted={toggleIsCompleted}
                />
            </span>
            <TodoPopUp
                todo={todo}
                toggleIsCompleted={toggleIsCompleted}
                deleteTodo={deleteTodo}
            >
                <div className="hover:cursor-pointer">
                    <CardHeader className="mt-4 pb-4">
                        <CardTitle className="text-xl">{todo.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground pb-8 overflow-hidden">
                        {`${todo.description.slice(0, 100)}...`}
                        <p className="inline ml-2 font-bold">Read More</p>
                    </CardContent>
                </div>
            </TodoPopUp>
            <CardFooter className="flex-col pb-10">
                <span
                    className={`text-sm text-muted-foreground w-full ${
                        new Date(todo.dueDate) > new Date() || !todo.dueDate
                            ? "text-primary"
                            : "text-red-500"
                    }`}
                >
                    {todo.dueDate
                        ? `${new Date(todo.dueDate).toLocaleDateString(
                              "en-GB",
                              {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                              }
                          )}`
                        : "No Due Date"}
                </span>
                <div className="flex gap-2 mt-3 w-full flex-wrap">
                    {todo.tags.map((tag: string) => (
                        <Badge key={tag} variant={"outline"}>
                            {tag}
                        </Badge>
                    ))}
                </div>
            </CardFooter>
            <Badge
                className="absolute right-1 bottom-1 rounded-xl"
                variant={
                    new Date(todo.dueDate) > new Date() ||
                    !todo.dueDate ||
                    todo.isCompleted
                        ? todo.isCompleted
                            ? "default"
                            : "secondary"
                        : "destructive"
                }
            >
                {todo.isCompleted ? "Completed" : "Pending"}
            </Badge>
        </Card>
    );
}

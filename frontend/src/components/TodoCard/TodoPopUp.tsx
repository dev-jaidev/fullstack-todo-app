import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { ScrollArea } from "../ui/scroll-area";
import TodoForm from "../TodoForm/TodoForm";
import AreYouSure from "../AreYouSure";

export default function TodoPopUp({
    children,
    todo,
    toggleIsCompleted,
    deleteTodo,
}: {
    children: React.ReactNode;
    todo: any;
    toggleIsCompleted: any;
    deleteTodo: any;
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{todo.title}</DialogTitle>
                </DialogHeader>
                <ScrollArea>
                    <DialogDescription className="max-w-[50vh]">
                        {todo.description}
                    </DialogDescription>
                </ScrollArea>
                <DialogFooter className="sm:justify-between justify-between flex-row flex w-full">
                    <Button
                        type="submit"
                        className="font-bold"
                        onClick={toggleIsCompleted}
                    >
                        {todo.isCompleted
                            ? "Mark as Pending"
                            : "Mark as Completed"}
                    </Button>
                    <div className="flex gap-2">
                        <TodoForm todo={todo}>
                            <Button size={"icon"}>
                                <FiEdit />
                            </Button>
                        </TodoForm>
                        <AreYouSure func={deleteTodo}>
                        <Button
                            size={"icon"}
                            variant={"destructive"}
                        >
                            <MdDelete />
                        </Button>
                        </AreYouSure>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

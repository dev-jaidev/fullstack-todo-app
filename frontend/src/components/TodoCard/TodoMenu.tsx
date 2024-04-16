import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import AreYouSure from "../AreYouSure";
import { Todo } from "@/lib/recoil/atoms";
import TodoForm from "../TodoForm/TodoForm";

export default function TodoDropDownMenu({
    todo,
    togglePin,
    deleteTodo,
    toggleIsCompleted,
}: {
    todo: Todo;
    togglePin: any;
    deleteTodo: any;
    toggleIsCompleted: any;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="p-1">
                <BsThreeDotsVertical size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="absolute right-0 w-40">
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={togglePin}>
                        {todo.isPinned ? "Unpin" : "Pin"}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <AreYouSure func={deleteTodo}>
                            <Button
                                variant="ghost"
                                className="p-1.5 w-full justify-start"
                            >
                                Delete
                            </Button>
                        </AreYouSure>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={toggleIsCompleted}>
                        {todo.isCompleted
                            ? "Mark as Pending"
                            : "Mark as Completed"}
                    </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                    <TodoForm todo={todo}>
                            <Button
                                variant="ghost"
                                className="p-1.5 w-full justify-start"
                            >
                                Edit
                            </Button>
                    </TodoForm>
                        </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

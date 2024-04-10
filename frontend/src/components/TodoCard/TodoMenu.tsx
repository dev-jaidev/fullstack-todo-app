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

export default function TodoDropDownMenu({
    todo,
    togglePin,
    deleteTodo,
    toggleIsCompleted,
}: {
    todo: any;
    togglePin: any;
    deleteTodo: any;
    toggleIsCompleted: any;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="p-1">
                <BsThreeDotsVertical size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="absolute right-0 w-20">
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={togglePin}>
                        {todo.isPinnded ? "Unpin" : "Pin"}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <AreYouSure func={deleteTodo}>
                            <Button variant="ghost" className="p-1.5">
                                Delete
                            </Button>
                        </AreYouSure>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={toggleIsCompleted}>
                        {todo.isCompleted
                            ? "Mark as Pending"
                            : "Mark as Completed"}
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { ScrollArea } from "../ui/scroll-area";

export default function TodoPopUp({children, todo}:{children: React.ReactNode, todo:any}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
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
          <Button type="submit" className="font-bold">Mark as Completed</Button>
          <div className="flex gap-2">
          <Button size={"icon"}><FiEdit /></Button>
          <Button size={"icon"} variant={"destructive"}><MdDelete /></Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

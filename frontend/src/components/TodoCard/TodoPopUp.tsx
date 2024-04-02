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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

export default function TodoPopUp({children}:{children: React.ReactNode}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <DialogDescription>
            Make changes to your profile here. Click save when done.
          </DialogDescription>
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

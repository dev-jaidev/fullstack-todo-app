import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { ReactNode, useState } from 'react'
import { useRecoilValue } from "recoil";
import { userDetails } from "@/lib/recoil/atoms";
import { DialogClose } from "@radix-ui/react-dialog";

const AreYouSure = ({children, func}: {children: ReactNode; func: any}) => {
    const userDetail = useRecoilValue(userDetails);
  return (
    <Dialog >
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are absolutely sure?</DialogTitle>
      <DialogDescription>
       {userDetail.user.name}, this action cannot be undone. Are you sure?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
    <DialogClose asChild>
      <Button type="submit" onClick={()=>{
        func()
      }}>Confirm</Button>
    </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
  )
}

export default AreYouSure



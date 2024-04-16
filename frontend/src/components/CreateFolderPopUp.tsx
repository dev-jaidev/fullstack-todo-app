import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../../config";
import { Folder, foldersAtom, userDetails } from "@/lib/recoil/atoms";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { toast } from "sonner";

export default function CreateFolderPopUP({
    children,
    folder,
}: {
    children: React.ReactNode;
    folder?: Folder;
}) {
    const [name, setName] = useState(folder?.name || "New Folder");
    const user = useRecoilValue(userDetails);
    const setFolders = useSetRecoilState(foldersAtom);
    const [open, setOpen] = useState(false);

    const submit = async () => {
        setOpen(false);

        try {
            if (folder) {
                const res = await axios.put(
                    `${BACKEND_URL}/folder/update?${folder._id}`,
                    { id: folder._id, name },
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    }
                );
                setFolders((prev) =>
                    prev.map((f) =>
                        f._id === folder._id ? res.data.data.folder : f
                    )
                );
                toast(res.data.message);
                return;
            }
            const res = await axios.post(
                `${BACKEND_URL}/folder/create`,
                { name },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            setFolders((prev) => [...prev, res.data.data.folder]);
            toast(res.data.message);
        } catch (error: any) {
            toast(error.response.data.message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Folder</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Name
                    </Label>
                    <Input
                        id="name"
                        value={name}
                        className="col-span-3"
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={submit}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

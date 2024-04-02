"use client"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import { userDetails } from "@/lib/recoil/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import axios from "axios";
import { BACKEND_URL } from "../../../config";
import { toast } from "sonner";
import AreYouSure from "../AreYouSure";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Account = ({ children }: { children: ReactNode }) => {
    const [userDetail, setUserDetail] = useRecoilState(userDetails);
    const [name, setName] = useState<string>(() => userDetail.user.name);
    const router = useRouter();
    const [password, setPassword] = useState<{
        oldPassword: string;
        newPassword: string;
    }>({
        oldPassword: "",
        newPassword: "",
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const changePass = async () => {
        try {
            const res = await axios.put(
                `${BACKEND_URL}/user/update-password`,
                { ...password },
                {
                    headers: {
                        Authorization: `Bearer ${userDetail.token}`,
                    },
                }
            );
            toast(res.data.message);
            router.refresh();
        } catch (error: any) {
            toast(error.response.data.message);
        }
    };
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        console.log(file);
        if (file) {
            setAvatarFile(file);
            setUserDetail((prev) => {
                return {
                    ...prev,
                    user: {
                        ...prev.user,
                        avatar: URL.createObjectURL(file),
                    },
                };
            });
        }
    };

    const handleUpdate = async () => {
        try {
          if (name !== userDetail.user.name) {
            await axios.put(
              `${BACKEND_URL}/user/update`,
              { name },
              {
                  headers: {
                      Authorization: `Bearer ${userDetail.token}`,
                  },
              }
          );
          }

            if (avatarFile) {
                const avatar = new FormData();
                avatar.append("avatar", avatarFile);
                await axios.put(`${BACKEND_URL}/user/update-avatar`, avatar, {
                    headers: {
                        Authorization: `Bearer ${userDetail.token}`,
                    },
                });
            }

            toast("Details updated");
            setAvatarFile(null)
            router.refresh();
        } catch (error: any) {
            toast(error.response.data.message);
        }
    };

    useEffect(() => {
      setName(userDetail.user.name);
  }, [userDetail.user.name]);

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent className="items-center justify-center">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        My Account
                    </DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="account" className="max-w-[400px]">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="password">Password</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account">
                        <Card>
                            <CardHeader>
                                <CardTitle>Account</CardTitle>
                                <CardDescription>
                                    Make changes to your account here. Click
                                    save when youre done.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1 justify-center flex">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: "none" }}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                    />
                                    <Avatar onClick={handleAvatarClick}>
                                        <AvatarImage
                                            src={userDetail.user.avatar}
                                            alt="Avatar"
                                        />
                                        <AvatarFallback>
                                            {userDetail.user.name.split("")[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        defaultValue={userDetail.user.name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        defaultValue={userDetail.user.email}
                                        disabled
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <AreYouSure func={handleUpdate}>
                                    <Button
                                        disabled={name == userDetail.user.name && avatarFile==null}
                                    >
                                        Save changes
                                    </Button>
                                </AreYouSure>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="password">
                        <Card>
                            <CardHeader>
                                <CardTitle>Password</CardTitle>
                                <CardDescription>
                                    Change your password here. After saving,
                                    youll be logged out.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="current">
                                        Current password
                                    </Label>
                                    <Input
                                        id="current"
                                        type="password"
                                        defaultValue={password.oldPassword}
                                        onChange={(e) =>
                                            setPassword((prev) => {
                                                prev.oldPassword =
                                                    e.target.value;
                                                return prev;
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="new">New password</Label>
                                    <Input
                                        id="new"
                                        type="password"
                                        defaultValue={password.oldPassword}
                                        onChange={(e) =>
                                            setPassword((prev) => {
                                                prev.newPassword =
                                                    e.target.value;
                                                return prev;
                                            })
                                        }
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <AreYouSure func={changePass}>
                                    <Button>Save password</Button>
                                </AreYouSure>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default Account;

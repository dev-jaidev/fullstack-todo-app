"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import zod from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { BACKEND_URL } from "../../../../config";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useIsUserLoggedIn } from "@/lib/hooks";

export default function ProfileForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter()

    const formSchema = zod.object({
        name: zod.string().min(3).trim(),
        email: zod.string().email(),
        password: zod.string().min(6),
        avatar: zod.any(),
    });

    const form = useForm<zod.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            avatar: "",
        },
    });

    const onSubmit = async (
        values: zod.infer<typeof formSchema>
    ): Promise<void> => {
        setIsLoading(true);
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
            if (key === 'avatar' && values.avatar) {
                formData.append(key, values.avatar);
            } else {
                formData.append(key, values[key as keyof typeof values]);
            }
        });
    
        try {
            const res = await axios.post(`${BACKEND_URL}/user/signup`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast(res.data.message);
            form.reset();
            router.push('/login')
        } catch (error: any) {
            toast(error.response.data.message);
        }
        finally{
            setIsLoading(false);
        }
    };

    useIsUserLoggedIn()

    return (
        <Form {...form}>
            <div className="w-full h-screen flex items-center justify-center flex-col">
                <h1 className="text-2xl font-bold mb-5">Sign Up</h1>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="max-w-sm container [&>*]:mb-3"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="Password" {...field} type="password"/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="avatar"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Avatar</FormLabel>
                                <FormControl>
                                    <Input
                                        id="avatar"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                field.onChange(file);
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        className="w-full mt-5 font-bold text-md"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                            Please wait
                            <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />
                            </>
                        ) : (
                            "Submit"
                        )}
                    </Button>
                </form>
                <Link href="/login" className="font-thin underline text-sm">Login</Link>
            </div>
        </Form>
    );
}

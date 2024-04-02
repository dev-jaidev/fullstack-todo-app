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
        email: zod.string().email(),
        password: zod.string()
    });

    const form = useForm<zod.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (
        values: zod.infer<typeof formSchema>
    ): Promise<void> => {
        setIsLoading(true);
        try {
            const res = await axios.post(`${BACKEND_URL}/user/login`, values);
            toast(res.data.message);
            if (res.status === 200) {
                localStorage.setItem("accessToken", res.data.data.accessToken);
                form.reset();
                router.push('/dashboard')
            }
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
                <h1 className="text-2xl font-bold mb-5">Login to Continue</h1>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="max-w-sm container [&>*]:mb-3"
                >
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
                <Link href="/signup" className="font-thin underline text-sm">Signup</Link>
            </div>
        </Form>
    );
}

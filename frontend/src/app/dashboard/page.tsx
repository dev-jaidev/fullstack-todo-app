"use client"

import { useIsUserLoggedIn } from "@/lib/hooks";

const Page = () => {
    useIsUserLoggedIn()

    return <div>DashBoard</div>;
};

export default Page;

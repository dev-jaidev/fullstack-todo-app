import { usePathname, useRouter } from "next/navigation";
import { BACKEND_URL } from "../../config";
import axios from "axios";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { userDetails } from "./recoil/atoms";

export const useIsUserLoggedIn = () => {
    const router = useRouter()
    const path = usePathname()
    const setUserDeatils = useSetRecoilState(userDetails);
    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(`${BACKEND_URL}/user/current-user`, { 
                    headers:{
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                    }
                });
                if (res.status === 200) {
                    router.push("/dashboard");
                    setUserDeatils({
                        token: localStorage.getItem("accessToken") || "",
                        user: {
                            name: res.data.data.user.name,
                            email: res.data.data.user.email,
                            avatar: res.data.data.user.avatar,   
                        },
                    });
                }
            } catch (error: any) {
                if(path === "/dashboard"){
                    router.push("/login");
                }
            }
        })();
    }, [path, router, setUserDeatils]);
}
import { atom } from "recoil";

export const userDetails = atom<{
    token: string;
    user: { name: string; email: string; avatar: string };
}>({
    key: "userDetails",
    default: {
        token: "",
        user: {
            name: "",
            email: "",
            avatar: "",
        },
    },
});

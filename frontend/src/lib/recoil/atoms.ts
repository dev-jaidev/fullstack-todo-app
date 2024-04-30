import { atom } from "recoil";

export interface UserDetails {
    token: string;
    user: { name: string; email: string; avatar: string };
}

export const userDetails = atom<UserDetails>({
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

export interface Todo {
    _id: string;
    title: string;
    parent: string;
    description: string;
    isCompleted: boolean;
    isPinned: boolean;
    tags: string[];
    priority: number;
    dueDate: string;
    createdAt: string;
}

export const todosAtom = atom<Todo[]>({
    key: "todos",
    default: [],
});

export interface Folder {
    _id: string;
    name: string;
}

export const foldersAtom = atom<Folder[]>({
    key: "folders",
    default: [],
});

export interface Tag {
    _id: string;
    todoCount: number;
}

export const tagsAtom = atom<Tag[]>({
    key: "tags",
    default: [],
});
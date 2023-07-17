import { Dispatch, SetStateAction } from "react";

export type User = {
    username: string,
    password?: string,  
}

export type UserUseState = {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
}

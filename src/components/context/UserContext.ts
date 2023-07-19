import { createContext } from "react";
import { UserUseState } from "../User/User";

const UserContext = createContext<UserUseState>({} as UserUseState); // Parameter inside is for default value, unnecessary here, it's for typescript

export default UserContext;

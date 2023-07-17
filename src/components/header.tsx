import Link from "next/link";
import React, { useContext } from "react";

import { ImHome3 } from "react-icons/im";
import { PiSignInBold } from "react-icons/pi";
import { FaUserAlt } from "react-icons/fa";

import { UserUseState, User } from "./User/User";
import UserContext from "./context/UserContext";

type Props = {};
const svgSize = 15;
const colorSvg = "white";
const Header = (props: Props) => {
  const userUseStateData: UserUseState = useContext(UserContext);
  const { user, setUser } = userUseStateData;

  // const { user }: { user: User | null } = useContext(UserContext);

  console.log(user);

  return (
    <header>
      {user !== null ? (
        <div>
          <FaUserAlt size={svgSize} color={colorSvg} />
          <span>{user.username}</span>
        </div>
      ) : (
        <Link href="/signin">
          <PiSignInBold size={svgSize} color={colorSvg} />
          <span>Sign In</span>
        </Link>
      )}
      <Link href="/">
        <ImHome3 size={svgSize} color={colorSvg} />
        <span>Homepage</span>
      </Link>
    </header>
  );
};

export default Header;

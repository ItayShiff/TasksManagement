import Link from "next/link";
import React, { useContext, useLayoutEffect } from "react";

import { ImHome3 } from "react-icons/im";
import { PiSignInBold } from "react-icons/pi";
import { FaUserAlt } from "react-icons/fa";

import { UserUseState } from "./User/User";
import UserContext from "./context/UserContext";
import axios from "axios";

type Props = {};
const svgSize = 14;
const colorSvg = "white";
const Header = (props: Props) => {
  const userUseStateData: UserUseState = useContext(UserContext);
  const { user, setUser } = userUseStateData;

  const SignOut = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const setUsernameIfValidatedToken = async (token: string): Promise<void> => {
    try {
      const { data } = await axios.post(`${process.env.API}/get-username-from-token`, { token });
      setUser({
        username: data,
        token: token,
      });
    } catch (err: any) {
      console.log("Token is invalid / user is not authenticated");
    }
  };

  const setUsernameIfLoggedInThePast = () => {
    const token = localStorage.getItem("user");
    if (token) {
      setUsernameIfValidatedToken(token);
    }
  };

  // On initial page load, loading user data if logged in the past
  useLayoutEffect(() => {
    if (user === null) {
      setUsernameIfLoggedInThePast();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header>
      {user !== null ? (
        <React.Fragment>
          <div>
            <span>Connected: </span>
            <FaUserAlt size={svgSize} color={colorSvg} />
            <span>{user.username}</span>
          </div>
          <div id="signout" onClick={SignOut}>
            <PiSignInBold size={svgSize} color={colorSvg} />
            <span>Sign Out</span>
          </div>
        </React.Fragment>
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

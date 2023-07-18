"use client";
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import { toast } from "react-toastify";
import axios from "axios";
import { UserUseState } from "@/components/User/User";
import UserContext from "@/components/context/UserContext";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { AiFillEye, AiOutlineUserAdd } from "react-icons/ai";
import { PiSignInBold } from "react-icons/pi";

type Props = {};

enum Mode {
  sign_in = 1,
  sign_up,
}

function Index({}: Props) {
  const [currentMode, setCurrentMode] = useState<Mode>(Mode.sign_in);

  const usernameInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);
  const [isShownPassword, setIsShownPassword] = useState(false);

  const userUseStateData: UserUseState = useContext(UserContext);
  const { user, setUser } = userUseStateData;

  const router: AppRouterInstance = useRouter();

  useLayoutEffect(() => {
    console.log(router, "Huh", user);
    if (user !== null) {
      router.push("/");
    }
  }, [router, user]);

  const signin = async () => {
    if (!usernameInput.current?.value || !passwordInput.current?.value) {
      toast.error("Username or password is missing");
      return;
    }

    try {
      const dataToSend = {
        username: usernameInput.current?.value,
        password: passwordInput.current?.value,
      };

      const { data } = await axios.post(`${process.env.API}/auth`, dataToSend); // Returning user token

      localStorage.setItem("user", data); // Keep in memory with localStorage
      setUser({ username: dataToSend.username, token: data });

      toast.success("Successfully logged in");
      router.push("/");
    } catch (err: any) {
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const signup = async () => {
    if (!usernameInput.current?.value || !passwordInput.current?.value) {
      toast.error("Username or password is missing");
      return;
    }

    try {
      const dataToSend = {
        username: usernameInput.current?.value,
        password: passwordInput.current?.value,
      };

      const res = await axios.post(`${process.env.API}/users`, dataToSend); // Returning user token

      toast.success(
        <div>
          <div>Successfully signed up!</div>
          <div>You can login in now</div>
        </div>
      );
      setCurrentMode(Mode.sign_in);

      // Resetting for login
      usernameInput.current.value = "";
      passwordInput.current.value = "";
    } catch (err: any) {
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const togglePassword = () => {
    setIsShownPassword((isShownPasswordCurrentValue) => !isShownPasswordCurrentValue);
  };

  return (
    <div id={styles.wrapperToWrapperSignIn}>
      <div id={styles.wrapperSignIn}>
        {currentMode === Mode.sign_in && <div id={styles.signInTitle}>Login Form</div>}
        {currentMode === Mode.sign_up && <div id={styles.signInTitle}>Registration Form</div>}

        <input type="text" id="user" name="user" ref={usernameInput} className={styles.input} placeholder="Username" />

        <div id={styles.passwordWrapper}>
          <input
            type={isShownPassword == false ? "password" : "text"}
            ref={passwordInput}
            className={styles.input}
            placeholder="Password"
          />
          <span onClick={togglePassword} className={isShownPassword === true ? styles.shownPassword : undefined}>
            <AiFillEye size="14" />
          </span>
        </div>

        {currentMode === Mode.sign_in && (
          <div className={styles.buttonsWrapper}>
            <button onClick={signin}>
              <PiSignInBold />
              <span>Login</span>
            </button>
            <button onClick={() => setCurrentMode(Mode.sign_up)}>Switch To Signup</button>
          </div>
        )}

        {currentMode === Mode.sign_up && (
          <div className={styles.buttonsWrapper}>
            <button onClick={signup}>
              <AiOutlineUserAdd />
              <span>Register</span>
            </button>
            <button onClick={() => setCurrentMode(Mode.sign_in)}>Switch To Signin</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Index;

"use client";
import React, { useLayoutEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

type Props = {};

enum Mode {
  sign_in = 1,
  sign_up,
}

function Index({}: Props) {
  const [currentMode, setCurrentMode] = useState<Mode>(Mode.sign_in);

  const usernameInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    document.title = "Sign In";
  }, []);

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

      console.log(dataToSend);

      const res = await axios.post(`${process.env.API}/auth`, dataToSend);
      // const res = await axios.post(`${process.env.API}/auth`, dataToSend, { mode: "no-cors" });
      // const test = await fetch(`${process.env.API}/auth`, {
      //   method: "GET", // or 'PUT'
      //   mode: "cors",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   // body: JSON.stringify(dataToSend),
      // });
      // console.log(test);
      // console.log(test.json());

      // console.log(res.data);

      toast.success("Success");
      setCurrentMode(Mode.sign_up);
    } catch (err: unknown) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  const signup = () => {
    if (!usernameInput.current?.value || !passwordInput.current?.value) {
      toast.error("Username or password is missing");
      return;
    }

    toast.success("Success");
    setCurrentMode(Mode.sign_in);
  };

  return (
    <div id={styles.wrapperToWrapperSignIn}>
      <div id={styles.wrapperSignIn}>
        <ToastContainer />
        {currentMode === Mode.sign_in && <div id={styles.signInTitle}>Login Form</div>}
        {currentMode === Mode.sign_up && <div id={styles.signInTitle}>Registration Form</div>}

        <input type="text" id="user" name="user" ref={usernameInput} className={styles.input} placeholder="Username" />

        <input type="password" id="pass" name="pass" ref={passwordInput} className={styles.input} placeholder="Password" />

        {currentMode === Mode.sign_in && (
          <div className={styles.buttonsWrapper}>
            <button onClick={signin}>Login</button>
            <button onClick={() => setCurrentMode(Mode.sign_up)}>Signup</button>
          </div>
        )}

        {currentMode === Mode.sign_up && (
          <div className={styles.buttonsWrapper}>
            <button onClick={signup}>Register</button>
            <button onClick={() => setCurrentMode(Mode.sign_in)}>Signin</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Index;

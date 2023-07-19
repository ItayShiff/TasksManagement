import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  timeToWaitInMS: number;
  text: string;
  func: () => void;
};

const GenericDebounceButton = ({ timeToWaitInMS, text, func }: Props) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const [didClick, setDidClick] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      // Cleanup
      // eslint-disable-next-line react-hooks/exhaustive-deps
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const initialClick = () => {
    func();
    toast.success("Successfully generated");
    setDidClick(true);

    setTimeout(() => {
      setDidClick(false);
    }, timeToWaitInMS);
  };

  const showError = () => {
    toast.error(`You already pressed this in last ${Math.round(timeToWaitInMS / 1000)} seconds, please wait`);
  };

  return <button onClick={didClick ? showError : initialClick}>{text}</button>;
};

export default GenericDebounceButton;

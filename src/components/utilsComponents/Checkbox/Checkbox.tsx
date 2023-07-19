import React, { useState } from "react";
import styles from "./Checkbox.module.css";
import { toast } from "react-toastify";

type Props = {
  isCompleted: boolean;
  amITheOwner: boolean;
  isTickedFromModal?: React.MutableRefObject<boolean>; // If the parent component wants to know if it's ticked or not
};

const Checkbox = ({ isCompleted, amITheOwner, isTickedFromModal }: Props) => {
  const [isChecked, setIsChecked] = useState(isCompleted);

  const toggleCheckbox = () => {
    if (amITheOwner === false) {
      toast.error("Nice try but you haven't created this task");
      return;
    }
    setIsChecked((currentState) => {
      // If the parent component wants to know if it's ticked or not
      if (isTickedFromModal) {
        isTickedFromModal.current = !isTickedFromModal.current;
      }

      return !currentState;
    });
  };

  return (
    <input
      type="checkbox"
      defaultChecked={isChecked}
      onChange={toggleCheckbox}
      className={isChecked ? `${styles.checkbox} ${styles.checked}` : `${styles.checkbox}`}
      disabled={amITheOwner === false}
    />
  );
};

export default Checkbox;

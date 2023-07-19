import React, { useEffect, useState } from "react";
import styles from "./Checkbox.module.css";
import { toast } from "react-toastify";

type Props = {
  isCompleted: boolean;
  amITheOwner: boolean;
  isTickedFromModal?: React.MutableRefObject<boolean>; // If the parent component wants to know if it's ticked or not
};

const Checkbox = ({ isCompleted, amITheOwner, isTickedFromModal }: Props) => {
  const [isChecked, setIsChecked] = useState(isCompleted);

  const isBeingEdited = isTickedFromModal !== undefined && isTickedFromModal.current !== undefined;
  const shouldDisableCheckbox = !isBeingEdited ?? amITheOwner === false; // If isBeingEdited so shouldDisableCheckbox = false, if !isBeingEdited so shouldDisableCheckbox = true, but if it's not mine so disable it only if i'm not the owner

  console.log(isBeingEdited);

  // For making sure isTickedFromModal is pointing to the right value of checkbox
  useEffect(() => {
    if (isBeingEdited) {
      isTickedFromModal.current = isChecked;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTickedFromModal]);

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
      // disabled={amITheOwner === false}
      disabled={shouldDisableCheckbox} // Means = if it's being edited so it's for sure mine, but if i'm not the owner so don't allow edit
    />
  );
};

export default Checkbox;

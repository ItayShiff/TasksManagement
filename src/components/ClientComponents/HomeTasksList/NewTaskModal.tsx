import React, { useRef } from "react";
import styles from "./NewTaskModal.module.css";
import Checkbox from "../Checkbox/Checkbox";
import { toast } from "react-toastify";
import tasksStore from "@/components/Task/tasks-store";
import Task from "@/components/Task/task";
import { v4 as uuidv4 } from "uuid";

type Props = {
  setIsOpenedNewTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const NewTaskModal = ({ setIsOpenedNewTaskModal }: Props) => {
  const isCompleted = useRef<boolean>(false);
  const titleInput = useRef<HTMLInputElement>(null);
  const descriptionInput = useRef<HTMLInputElement>(null);

  const createNewTask = () => {
    if (!titleInput.current?.value || !descriptionInput.current?.value) {
      toast.error("You didn't fill in title or description");
    } else {
      const taskToBeCreated: Task = {
        id: uuidv4(),
        user_id: "id",
        title: titleInput.current.value,
        description: descriptionInput.current.value,
        completed: isCompleted.current,
      };

      toast.success("Succesfully added a new task");
    }
  };

  return (
    <div id={styles.wrapper}>
      <div id={styles.contentModal}>
        <button id={styles.closeModalButton} onClick={() => setIsOpenedNewTaskModal(false)}>
          X
        </button>

        <div id={styles.titleCreateNewTask}>Create a new task</div>

        <div id={styles.contentModalFlex}>
          <div id={styles.isCompletedContainer}>
            <div>Is Completed?</div>
            <Checkbox isCompleted={false} amITheOwner={true} isTickedFromModal={isCompleted} />
          </div>

          <div id={styles.containerInputs}>
            <input placeholder="Enter title" ref={titleInput} />
            <input placeholder="Enter description" ref={descriptionInput} />
          </div>
          <button onClick={createNewTask}>Create</button>
        </div>
      </div>
    </div>
  );
};

export default NewTaskModal;

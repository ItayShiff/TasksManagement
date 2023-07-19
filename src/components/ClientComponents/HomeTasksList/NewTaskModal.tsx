import React, { useContext, useRef } from "react";
import styles from "./NewTaskModal.module.css";
import Checkbox from "../../utilsComponents/Checkbox/Checkbox";
import { toast } from "react-toastify";
import tasksStore from "@/components/Task/tasks-store";
import { CompletedOptions, TaskToBeCreated } from "@/components/Task/task";
import { v4 as uuidv4 } from "uuid";
import UserContext from "@/components/context/UserContext";
import { UserUseState } from "@/components/User/User";

type Props = {
  setIsOpenedNewTaskModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const NewTaskModal = ({ setIsOpenedNewTaskModal }: Props) => {
  const isCompleted = useRef<boolean>(false);
  const titleInput = useRef<HTMLInputElement>(null);
  const descriptionInput = useRef<HTMLInputElement>(null);

  const userUseStateData: UserUseState = useContext(UserContext);
  const { user } = userUseStateData;

  const createNewTask = () => {
    if (!user) {
      toast.error("No permission, only registered users can create tasks");
      return;
    }

    if (!titleInput.current?.value || !descriptionInput.current?.value) {
      toast.error("You didn't fill in title or description");
      return;
    }

    const taskToBeCreated: TaskToBeCreated = {
      id: uuidv4(),
      userId: user.username,
      title: titleInput.current.value,
      description: descriptionInput.current.value,
      completed: Number(isCompleted.current), // MySql saves bool as 1 or 0
      token: user.token,
    };

    tasksStore.createTask(taskToBeCreated);
    toast.success("Succesfully added a new task");
    setIsOpenedNewTaskModal(false);
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

import React, { useContext, useState } from "react";
import styles from "./FuncRelatedToTasks.module.css";
import tasksStore from "@/components/Task/tasks-store";
import GenericDebounceButton from "@/components/utilsComponents/GenericDebounceButton";
import ApplySearchFilter from "./ApplySearchFilter";
import NewTaskModal from "./NewTaskModal";
import { toast } from "react-toastify";
import { UserUseState } from "@/components/User/User";
import UserContext from "@/components/context/UserContext";
import { observer } from "mobx-react";

export enum FilterBy {
  No_Filter = 0,
  User_ID,
  Task_ID,
}

// Getting only the keys from FilterBy - the strings | Reason doing isNaN(Number) is Object.keys(enum) = ['1','2', 'key1', 'key2'] - getting only strings with with isNaN(Number(curr))
const filterByOptions = Object.keys(FilterBy).reduce((acc: string[], curr: string) => {
  if (isNaN(Number(curr))) {
    acc.push(curr.replaceAll("_", " "));
  }
  return acc;
}, []);

type Props = {};

const FuncRelatedToTasks = (props: Props) => {
  const [isOpenedNewTaskModal, setIsOpenedNewTaskModal] = useState<boolean>(false);
  const userUseStateData: UserUseState = useContext(UserContext);
  const { user } = userUseStateData;

  const openCreateNewTaskModal = () => {
    if (user === null) {
      toast.error("You must be logged in to create a new task");
      return;
    }

    setIsOpenedNewTaskModal(true);
  };

  const updateAllTasks = () => {
    tasksStore.getAllTasks();
  };

  // console.log(tasksStore.numberOfTasksPerUser);

  return (
    <div>
      {isOpenedNewTaskModal && <NewTaskModal setIsOpenedNewTaskModal={setIsOpenedNewTaskModal} />}

      <div id={styles.firstLineContainer}>
        <button onClick={openCreateNewTaskModal}>Create New Task</button>
        <details id={styles.details}>
          <summary>Some Statistics Regarding Tasks</summary>
          <div>
            <u>Number of completed tasks:</u> {tasksStore.numberOfCompletedTasks}
          </div>
          <div>
            <u>Users and how many tasks they own:</u>
          </div>
          <ul>
            {Object.keys(tasksStore.numberOfTasksPerUser).map((currUser: string, index: number) => (
              <li key={currUser + index}>
                {currUser}: {tasksStore.numberOfTasksPerUser[currUser]}
              </li>
            ))}
          </ul>
        </details>
        <GenericDebounceButton timeToWaitInMS={7000} text={"Update All Tasks"} func={updateAllTasks} />
      </div>

      <ApplySearchFilter filterByOptions={filterByOptions} />
    </div>
  );
};

export default observer(FuncRelatedToTasks);

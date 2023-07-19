/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import styles from "./HomeTasksList.module.css";
import Task, { CompletedOptions } from "../../Task/task";
import React, { useContext, useLayoutEffect, useState } from "react";
import tasksStore from "../../Task/tasks-store";

import { observer } from "mobx-react";
import Checkbox from "../../utilsComponents/Checkbox/Checkbox";
import UserContext from "../../context/UserContext";
import { UserUseState } from "../../User/User";
import ApplySearchFilter from "./ApplySearchFilter";
import NewTaskModal from "./NewTaskModal";
import { toast } from "react-toastify";
import GenericDebounceButton from "@/components/utilsComponents/GenericDebounceButton";

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

type Props = {
  Tasks: Task[];
};

const HomeTasksList = ({ Tasks }: Props) => {
  const userUseStateData: UserUseState = useContext(UserContext);
  const { user } = userUseStateData;
  const [isOpenedNewTaskModal, setIsOpenedNewTaskModal] = useState(false);

  // For initializating the tasks in store, Tasks generated from server component
  useLayoutEffect(() => {
    tasksStore.tasksArr = Tasks;
  }, []);

  console.log("This is my tasks", Tasks);
  // console.log(tasksStore.tasksArr);

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

  const deleteTask = (task_id: string) => {
    if (user === null) {
      toast.error("You must be logged in to remove a task");
      return;
    }

    tasksStore.deleteTask({
      id: task_id,
      token: user?.token,
    });
  };

  console.log(tasksStore.numberOfCompletedTasksPerUser);

  return (
    <div id={styles.wrapperTasks}>
      {isOpenedNewTaskModal && <NewTaskModal setIsOpenedNewTaskModal={setIsOpenedNewTaskModal} />}

      <div id={styles.firstLineContainer}>
        <div>Number of completed tasks: {tasksStore.numberOfCompletedTasks}</div>

        <ul>
          {Object.keys(tasksStore.numberOfCompletedTasksPerUser).map((currUser: string, index: number) => (
            <li key={currUser + index}>
              {currUser}: {tasksStore.numberOfCompletedTasksPerUser[currUser]}
            </li>
          ))}
        </ul>

        <button onClick={openCreateNewTaskModal}>Create New Task</button>
        <GenericDebounceButton timeToWaitInMS={7000} text={"Update All Tasks"} func={updateAllTasks} />
      </div>

      <ApplySearchFilter filterByOptions={filterByOptions} />

      <div>
        {tasksStore.tasksArr.map((todo: Task) => (
          <div key={todo.id} className={styles.task}>
            <Checkbox isCompleted={todo.completed == CompletedOptions.TRUE} amITheOwner={todo.user_id === user?.username} />
            <div className={`${styles.titleAndDescription} ${styles.titleAndDescriptionNames}`}>
              <div>Title:</div>
              <div>Description:</div>
            </div>
            <div className={styles.titleAndDescription}>
              <div>{todo.title}</div>
              <div>{todo.description}</div>
            </div>

            {todo.user_id === user?.username && (
              <div>
                <button>Edit</button>
                <button onClick={() => deleteTask(todo.id)}>Remove</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default observer(HomeTasksList);

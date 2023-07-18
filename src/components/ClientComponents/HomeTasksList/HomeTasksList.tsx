/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import styles from "./HomeTasksList.module.css";
import Task from "../../Task/task";
import React, { useContext, useLayoutEffect, useState } from "react";
import tasksStore from "../../Task/tasks-store";

import { observer } from "mobx-react";
import Checkbox from "../Checkbox/Checkbox";
import UserContext from "../../context/UserContext";
import { UserUseState } from "../../User/User";
import ApplySearchFilter from "./ApplySearchFilter";
import NewTaskModal from "./NewTaskModal";
import { toast } from "react-toastify";

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

  // console.log("This is my tasks", Tasks);
  // console.log(tasksStore.tasksArr);

  const openCreateNewTaskModal = () => {
    if (user === null) {
      toast.error("You must be logged in to create a new task");
      return;
    }

    setIsOpenedNewTaskModal(true);
  };

  return (
    <div id={styles.wrapperTasks}>
      <button onClick={openCreateNewTaskModal}>Create New Task</button>
      {isOpenedNewTaskModal && <NewTaskModal setIsOpenedNewTaskModal={setIsOpenedNewTaskModal} />}

      <button>Update All Tasks</button>

      <ApplySearchFilter filterByOptions={filterByOptions} />

      <div>
        {tasksStore.tasksArr.map((todo: Task) => (
          <div key={todo.id} className={styles.task}>
            <Checkbox isCompleted={todo.completed} amITheOwner={todo.user_id === user?.username} />
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
                <button>Remove</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default observer(HomeTasksList);

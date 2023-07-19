/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import styles from "./HomeTasksList.module.css";
import Task, { CompletedOptions } from "../../Task/task";
import React, { useContext, useLayoutEffect } from "react";
import tasksStore from "../../Task/tasks-store";

import { observer } from "mobx-react";
import Checkbox from "../../utilsComponents/Checkbox/Checkbox";
import UserContext from "../../context/UserContext";
import { UserUseState } from "../../User/User";
import { toast } from "react-toastify";
import FuncRelatedToTasks from "./FuncRelatedToTasks/FuncRelatedToTasks";

type Props = {
  Tasks: Task[];
};

const HomeTasksList = ({ Tasks }: Props) => {
  const userUseStateData: UserUseState = useContext(UserContext);
  const { user } = userUseStateData;

  // For initializating the tasks in store, Tasks generated from server component
  useLayoutEffect(() => {
    tasksStore.tasksArr = Tasks;
  }, []);

  console.log("This is my tasks", Tasks);
  // console.log(tasksStore.tasksArr);

  const editTask = (todo_index: number) => {
    tasksStore.editTask(todo_index);
  };

  console.log(tasksStore.currentlyEditingTasks);

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

  console.log(tasksStore.currentlyEditingTasksSorted);

  return (
    <div id={styles.wrapperTasks}>
      <FuncRelatedToTasks />

      {tasksStore.currentlyEditingTasksSorted.map((str: boolean, index: number) => (
        <div key={index}>{str ? "YAY" : "NAY"}</div>
      ))}

      {tasksStore.tasksArr.map((todo: Task, index: number) => (
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
              <button onClick={() => editTask(index)}>Edit</button>
              <button onClick={() => deleteTask(todo.id)}>Remove</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default observer(HomeTasksList);

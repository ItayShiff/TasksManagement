/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import styles from "./HomeTasksList.module.css";
import Task, { CompletedOptions, TaskToBeEdited } from "../../Task/task";
import React, { useContext, useLayoutEffect, useRef } from "react";
import { BsInfoCircleFill } from "react-icons/bs";
import tasksStore from "../../Task/tasks-store";
import { observer } from "mobx-react";
import Checkbox from "../../utilsComponents/Checkbox/Checkbox";
import UserContext from "../../context/UserContext";
import { toast } from "react-toastify";
import { UserUseState } from "../../User/User";
import FuncRelatedToTasks from "./FuncRelatedToTasks/FuncRelatedToTasks";

type Props = {
  Tasks: Task[];
};

const HomeTasksList = ({ Tasks }: Props) => {
  const userUseStateData: UserUseState = useContext(UserContext);
  const { user } = userUseStateData;

  // This 3 useRefs will reassign to the correct value refs, when clicked Edit
  const titleInput = useRef<HTMLInputElement>(null);
  const descriptionInput = useRef<HTMLInputElement>(null);
  const isCompleted = useRef<boolean>(false);

  // For initializating the tasks in store, Tasks generated from server component
  useLayoutEffect(() => {
    tasksStore.tasksArr = Tasks;
  }, []);

  const editTask = (task_index: number) => {
    tasksStore.editTask(task_index);
  };

  const discardEditTask = () => {
    tasksStore.discardEditTask();
  };

  const saveEditedTask = (task_id: string, task_index: number) => {
    if (!user) {
      toast.error("No permission, only registered users can create tasks");
      return;
    }

    const taskToBeEdited: TaskToBeEdited = {
      user_id: user.username,
      title: titleInput.current!.value,
      description: descriptionInput.current!.value,
      completed: Number(isCompleted.current), // MySql saves bool as 1 or 0
      token: user.token,
    };

    tasksStore.saveEditedTask(task_id, taskToBeEdited, task_index);
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

  return (
    <div id={styles.wrapperTasks}>
      <FuncRelatedToTasks />

      <div id={styles.titleGuide}> You are able to create/update/remove only the tasks you created</div>

      {tasksStore.tasksArr.length === 0 ? (
        <div id={styles.noResultsFound}>No Results Found</div>
      ) : (
        <React.Fragment>
          {tasksStore.tasksArr.map((task: Task, index: number) => (
            <div key={task.id} className={styles.task}>
              <div data-owner={task.user_id} data-task_id={task.id} className={styles.info}>
                <BsInfoCircleFill />
              </div>
              <Checkbox
                isCompleted={task.completed == CompletedOptions.TRUE}
                amITheOwner={task.user_id === user?.username}
                isTickedFromModal={tasksStore.currentlyEditingTaskIndex === index ? isCompleted : undefined}
              />
              <div className={`${styles.titleAndDescription} ${styles.titleAndDescriptionNames}`}>
                <div>Title:</div>
                <div>Description:</div>
              </div>

              {tasksStore.currentlyEditingTaskIndex !== index ? (
                <div className={styles.titleAndDescription}>
                  <div>{task.title}</div>
                  <div>{task.description}</div>
                </div>
              ) : (
                <div className={styles.titleAndDescription}>
                  <input defaultValue={task.title} ref={titleInput} className={styles.inputEdit} />
                  <input defaultValue={task.description} ref={descriptionInput} className={styles.inputEdit} />
                </div>
              )}

              {task.user_id === user?.username && (
                <div>
                  {tasksStore.currentlyEditingTaskIndex !== index ? (
                    <button onClick={() => editTask(index)}>Edit</button>
                  ) : (
                    <React.Fragment>
                      <button onClick={() => discardEditTask()}>Discard Edit</button>
                      <button onClick={() => saveEditedTask(task.id, index)}>Save Edit</button>
                    </React.Fragment>
                  )}
                  <button onClick={() => deleteTask(task.id)}>Remove</button>
                </div>
              )}
            </div>
          ))}
        </React.Fragment>
      )}
    </div>
  );
};

export default observer(HomeTasksList);

import React, { useContext, useState } from "react";
import tasksStore from "@/components/Task/tasks-store";
import GenericDebounceButton from "@/components/utilsComponents/GenericDebounceButton";
import ApplySearchFilter from "./ApplySearchFilter";
import NewTaskModal from "./NewTaskModal";
import { toast } from "react-toastify";
import { UserUseState } from "@/components/User/User";
import UserContext from "@/components/context/UserContext";
import { observer } from "mobx-react";
import UsersStats from "./UsersStats";

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

  const [notifier, setNotifier] = useState<number>(-1); // Used to tell sibling components, that when clicked Updated All Tasks from genericButton - so it will change back the filter to "No Filter" in ApplyFilter component

  const openCreateNewTaskModal = () => {
    if (user === null) {
      toast.error("You must be logged in to create a new task");
      return;
    }

    setIsOpenedNewTaskModal(true);
  };

  const updateAllTasks = () => {
    tasksStore.getAllTasks();
    setNotifier((oldNotifierValue) => oldNotifierValue + 1);
  };

  return (
    <div>
      {isOpenedNewTaskModal && (
        <NewTaskModal setIsOpenedNewTaskModal={setIsOpenedNewTaskModal} updateAllTasks={updateAllTasks} />
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
        <button onClick={openCreateNewTaskModal}>Create New Task</button>
        <UsersStats />
        <GenericDebounceButton timeToWaitInMS={7000} text={"Update All Tasks"} func={updateAllTasks} />
      </div>

      <ApplySearchFilter filterByOptions={filterByOptions} notifier={notifier} />
    </div>
  );
};

export default observer(FuncRelatedToTasks);

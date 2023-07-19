import tasksStore from "@/components/Task/tasks-store";
import { observer } from "mobx-react";
import React from "react";

type Props = {};

const UsersStats = (props: Props) => {
  return (
    <button>
      <details style={{ cursor: "pointer", textAlign: "left" }}>
        <summary>
          <b>Click Here</b> To See Some Statistics
        </summary>
        <div>
          <b>Number of completed tasks:</b> {tasksStore.numberOfCompletedTasks}
        </div>
        <div>
          <b>Users and how many tasks they own:</b>
        </div>
        <ul>
          {Object.keys(tasksStore.numberOfTasksPerUser).map((currUser: string, index: number) => (
            <li key={currUser + index}>
              {currUser}: {tasksStore.numberOfTasksPerUser[currUser]}
            </li>
          ))}
        </ul>
      </details>
    </button>
  );
};

export default observer(UsersStats);

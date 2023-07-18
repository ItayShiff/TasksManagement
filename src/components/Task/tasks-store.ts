import axios from "axios";
import Task from "./task";
import { makeAutoObservable, observable, computed, action, runInAction } from "mobx";

// This is made to allow the functionality of ObservableArrayAdministration because we want to utilize the replace method to change observable array data,
// There isn't ObservableArrayAdministration<Task> so this is so the solution I came up with
type TaskArray = Task[] & {
  replace?: (value: Task[]) => void;
};

class TasksStore {
  // tasksArr: Task[] = [];
  // tasksArr: any = [];
  tasksArr: TaskArray = [] as TaskArray;

  get numberOfCompletedTasks(): number {
    let counter = 0;
    for (let task of this.tasksArr) {
      if (task.completed) {
        counter++;
      }
    }

    return counter;
  }

  constructor() {
    makeAutoObservable(this);
  }

  createTask() {
    // this.githubProjects = []
    // this.state = "pending"
    // fetchGithubProjectsSomehow().then(
    //     action("fetchSuccess", projects => {
    //         const filteredProjects = somePreprocessing(projects)
    //         this.githubProjects = filteredProjects
    //         this.state = "done"
    //     }),
    //     action("fetchError", () => {
    //         this.state = "error"
    //     })
    // )
    // this.tasksArr.push(new Task())
  }

  editTask() {}

  deleteTask() {}

  filterTasksByTaskID(task_id: string) {
    this.genericGetUpdateTasks(`${process.env.API}/task/${task_id}`);
  }

  filterTasksByUserID(user_id: string) {
    this.genericGetUpdateTasks(`${process.env.API}/tasks?userId=${user_id}`);
  }

  getAllTasks() {
    this.genericGetUpdateTasks(`${process.env.API}/tasks`);
  }

  async genericGetUpdateTasks(api: string) {
    try {
      const { data } = await axios.get(api);

      runInAction(() => {
        // This is equal to doing - this.tasksArr = data , doing it with "replace" because it's observableArray of MobX
        this.tasksArr.replace!(data);
      });
    } catch (err) {
      runInAction(() => {
        this.tasksArr = [];
      });
    }
  }

  *flow() {
    const response: Task[] = yield fetch("http://example.com/value");

    // return (yield response.json());
  }
}

const tasksStore = new TasksStore();

export default tasksStore;

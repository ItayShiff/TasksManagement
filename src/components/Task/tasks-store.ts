import axios, { AxiosResponse } from "axios";
import Task, { TaskToBeCreated } from "./task";
import { makeAutoObservable, observable, computed, action, runInAction } from "mobx";

enum Method {
  GET,
  POST,
  DELETE,
  PUT,
}

// This is made to allow the functionality of ObservableArrayAdministration because we want to utilize the replace method to change observable array data,
// There isn't ObservableArrayAdministration<Task> so this is so the solution I came up with
type TaskArray = Task[] & {
  replace?: (value: Task[]) => void;
};

class TasksStore {
  tasksArr: TaskArray = [] as TaskArray;
  currentlyEditingTasks = new Set<number>(); // Will hold id of indices of tasks which the user is editing right now

  get numberOfCompletedTasks(): number {
    let counter = 0;
    for (let task of this.tasksArr) {
      if (task.completed) {
        counter++;
      }
    }

    return counter;
  }

  get currentlyEditingTasksSorted(): boolean[] {
    let res = Array(this.tasksArr.length).fill(false);
    this.currentlyEditingTasks.forEach((taskToEdit) => {
      res[taskToEdit] = true;
    });

    return res;
  }

  get numberOfCompletedTasksPerUser(): { [key: string]: number } {
    const res: { [key: string]: number } = {};

    for (let task of this.tasksArr) {
      if (task.user_id in res) {
        res[task.user_id]++;
      } else {
        res[task.user_id] = 1;
      }
    }

    return res;
  }

  constructor() {
    makeAutoObservable(this);
  }

  createTask(task: TaskToBeCreated) {
    this.genericAPIRequest(Method.POST, `${process.env.API}/task`, task);
    const newTask: Task = {
      id: task.id,
      user_id: task.userId,
      title: task.title,
      description: task.description,
      completed: task.completed,
    };

    this.tasksArr.push(newTask);
  }

  editTask(todo_index: number) {
    this.currentlyEditingTasks.add(todo_index);
  }

  deleteTask(task_id_with_token: { id: string; token: string }) {
    const bodyToSend = { token: task_id_with_token.token };
    this.genericAPIRequest(Method.DELETE, `${process.env.API}/task/${task_id_with_token.id}`, bodyToSend);

    const updatedTasksArr = this.tasksArr.filter((currTask) => currTask.id !== task_id_with_token.id);
    this.tasksArr.replace!(updatedTasksArr);
  }

  filterTasksByTaskID(task_id: string) {
    this.genericAPIRequest(Method.GET, `${process.env.API}/task/${task_id}`);
  }

  filterTasksByUserID(user_id: string) {
    this.genericAPIRequest(Method.GET, `${process.env.API}/tasks?userId=${user_id}`);
  }

  getAllTasks() {
    this.genericAPIRequest(Method.GET, `${process.env.API}/tasks`);
  }

  private genericAPIRequest = (method: Method, api: string, body?: any) => {
    let nextCall: Promise<AxiosResponse<any, any>>;
    switch (method) {
      case Method.GET:
        nextCall = axios.get(api);
        break;

      case Method.POST:
        nextCall = axios.post(api, body);
        break;

      case Method.DELETE:
        nextCall = axios.delete(api, { data: body });
        break;

      case Method.PUT:
        nextCall = axios.put(api, body);
        break;
    }

    this.executeGenericAPIRequest(nextCall);
  };

  private async executeGenericAPIRequest(APICall: Promise<AxiosResponse<any, any>>) {
    let res: TaskArray;
    try {
      const { data } = await APICall;
      res = data;
    } catch (err: any) {
      console.log(err.message);
      res = [];
      console.log("WHAAAAAAAAAAAAAAAAAAAT why here??", err);
    }

    try {
      runInAction(() => {
        // This is equal to doing - this.tasksArr = data , doing it with "replace" because it's observableArray of MobX
        this.tasksArr.replace!(res);
      });
    } catch (err: any) {}
  }

  *flow() {
    const response: Task[] = yield fetch("http://example.com/value");

    // return (yield response.json());
  }
}

const tasksStore = new TasksStore();

export default tasksStore;

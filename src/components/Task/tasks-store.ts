import axios, { AxiosResponse } from "axios";
import Task, { CompletedOptions, TaskToBeCreated, TaskToBeEdited } from "./task";
import { makeAutoObservable, observable, computed, action, runInAction } from "mobx";
import { toast } from "react-toastify";

enum Method {
  GET,
  POST,
  DELETE,
  PUT,
}

// This is made to allow the functionality of ObservableArrayAdministration with typescript because we want to utilize the replace method to change observable array data,
// There isn't ObservableArrayAdministration<Task> so this is the way to achieve it
type TaskArray = Task[] & {
  replace?: (value: Task[]) => void;
};

class TasksStore {
  tasksArr: TaskArray = [] as TaskArray;
  currentlyEditingTaskIndex: number | null = null; // Will hold index of task currently editing

  get numberOfCompletedTasks(): number {
    let counter = 0;
    for (let task of this.tasksArr) {
      if (Number(task.completed)) {
        // console.log("Okay cmpleted??", task.completed);

        counter++;
      }
    }

    return counter;
  }

  get numberOfTasksPerUser(): { [key: string]: number } {
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

  async createTask(task: TaskToBeCreated) {
    const isSuccessRequest = await this.genericAPIRequest(Method.POST, `${process.env.API}/task`, task);

    if (isSuccessRequest === true) {
      const newTask: Task = {
        id: task.id,
        user_id: task.userId,
        title: task.title,
        description: task.description,
        completed: task.completed,
      };

      this.tasksArr.push(newTask);
      toast.success("Successfully created a new task");
    }
  }

  editTask(todo_index: number) {
    this.currentlyEditingTaskIndex = todo_index;
  }

  discardEditTask() {
    this.currentlyEditingTaskIndex = null;
  }

  async saveEditedTask(task_id: string, editedTask: TaskToBeEdited, task_index: number) {
    const isSuccessRequest = await this.genericAPIRequest(Method.PUT, `${process.env.API}/task/${task_id}`, editedTask);

    if (isSuccessRequest === true) {
      this.tasksArr[task_index].title = editedTask.title;
      this.tasksArr[task_index].description = editedTask.description;
      this.tasksArr[task_index].completed = editedTask.completed;
      toast.success("Successfully edited task");
    }
  }

  async deleteTask(task_id_with_token: { id: string; token: string }) {
    const bodyToSend = { token: task_id_with_token.token };
    const isSuccessRequest = await this.genericAPIRequest(
      Method.DELETE,
      `${process.env.API}/task/${task_id_with_token.id}`,
      bodyToSend
    );

    if (isSuccessRequest === true) {
      const updatedTasksArr = this.tasksArr.filter((currTask) => currTask.id !== task_id_with_token.id);
      this.tasksArr.replace!(updatedTasksArr);
      toast.success("Successfully deleted task");
    }
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

  private genericAPIRequest = (method: Method, api: string, body?: any): Promise<boolean> => {
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

    return this.executeGenericAPIRequest(nextCall);
  };

  private async executeGenericAPIRequest(APICall: Promise<AxiosResponse<any, any>>): Promise<boolean> {
    let res: TaskArray;
    let isSuccessRequest: boolean = false;
    try {
      const { data } = await APICall;

      if (Array.isArray(data)) {
        res = data;
      } else if (data && Object.keys(data).length === 0) {
        res = [];
      }
      isSuccessRequest = true;
    } catch (err: any) {
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
      }

      isSuccessRequest = false;
    }

    try {
      runInAction(() => {
        if (Array.isArray(res)) {
          this.tasksArr.replace!(res); // This is equal to doing - this.tasksArr = data , doing it with "replace" because it's observableArray of MobX
        }
        this.currentlyEditingTaskIndex = null; // Resetting
      });
    } catch (err: any) {}

    return isSuccessRequest;
  }

  *flow() {
    const response: Task[] = yield fetch("http://example.com/value");

    // return (yield response.json());
  }
}

const tasksStore = new TasksStore();

export default tasksStore;

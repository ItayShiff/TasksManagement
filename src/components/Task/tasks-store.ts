import Task from "./task"
import { makeAutoObservable, observable, computed, action } from "mobx";


class TasksStore {
    tasksArr: Task[] = [];

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

    createTodo() {
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

    *flow() {
        const response: Task[] = yield fetch("http://example.com/value")

        // return (yield response.json());
    }
}

export default new TasksStore()
import { makeObservable, observable } from "mobx";

// class Task {
//     private id: string;
//     private title: string;
//     private description: string;
//     private completed: boolean;

//     constructor(_id: string, _title: string, _description: string, _completed: boolean) {
//         // Passing relevant private fields as generic argument
//         makeObservable<this, "id" | "title" | "description" | "completed">(this, {
//             id: observable,
//             title: observable,
//             description: observable,
//             completed: observable
//         })

//         this.id = _id;
//         this.title = _title;
//         this.description = _description;
//         this.completed = _completed;
//     }
// }

// class Task {
//     public id: string;
//     public title: string;
//     public description: string;
//     public completed: boolean;

//     constructor(_id: string, _title: string, _description: string, _completed: boolean) {
//         makeObservable(this, {
//             id: observable,
//             title: observable,
//             description: observable,
//             completed: observable
//         })

//         this.id = _id;
//         this.title = _title;
//         this.description = _description;
//         this.completed = _completed;
//     }
// }

export const enum CompletedOptions {
  FALSE,
  TRUE,
}

interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  completed: CompletedOptions; // Should be boolean but MySQL does not have a boolean data type, so it stores "1" or "0"
}

export type TaskToBeCreated = Omit<Task, "user_id"> & { userId: string; token: string };

export default Task;

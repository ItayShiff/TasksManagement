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
export type TaskToBeEdited = Omit<Task, "id"> & { token: string };

export default Task;

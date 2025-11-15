import { taskDao } from "../_data-access/taskDao";
import { TaskFormSchema } from "../_schema/taskSchema";

/** タスクを作成する */
export const createTask = async (task: TaskFormSchema) => {
  // タスクを挿入する
  const id = await taskDao.insert({
    name: task.name,
    detail: task.detail,
    status_id: task.status_id!,
    send_mail: task.send_mail,
  })
  return id
}

import { taskDao } from "../_data-access/taskDao";
import { TaskFormSchema } from "../_schema/taskSchema";

/** タスクを更新する */
export const updateTask = async (task: TaskFormSchema) => {
  // タスクを更新する
  await taskDao.update({
    id: task.id!,
    name: task.name,
    detail: task.detail,
    status_id: task.status_id!,
    send_mail: task.send_mail,
    updated_at: task.updated_at!,
  })
}

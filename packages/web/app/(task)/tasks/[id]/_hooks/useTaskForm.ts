import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createTaskSchemaFromEntity, rawTask, TaskFormSchema, taskFormSchema } from "../../../_schema/taskSchema"
import useSWR from "swr"
import { fetchTask } from "../../../_query/taskQuery"
import { useEffect, useState } from "react"

/** タスクフォームを取得する */
export const useTaskForm = ({id}: {id: number}) => {

  /** タスクフォームのデフォルト値 */
  const defaultTask: TaskFormSchema = {
    id: 0,
    name: "",
    detail: "",
    status_id: undefined,
    send_mail: false,
    created_at: undefined,
    updated_at: undefined
  }

  // タスクフォームの状態を作成する
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<TaskFormSchema>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: defaultTask
  })

  // IDに紐づくタスクを取得する
  const { data: taskEntity, error, mutate, isLoading } = useSWR(
    id ? ["タスク", id] : null,
    () => fetchTask(id)
  )

  // エラーをチェックする
  if (error) throw error

  /** 取得時のタスクデータ */
  const [fetchedTask, setFetchedTask] = useState(defaultTask)

  // タスクを取得できた場合、状態にセットする
  useEffect(() => {
    if (taskEntity != null) {
      const schemaTask = createTaskSchemaFromEntity(taskEntity)
      setFetchedTask(schemaTask)
      reset(schemaTask)
    }
  }, [taskEntity])

  /** 現在の入力データ */
  const currentTasks = watch()

  /** 値を変更したかどうか */
  const isValueChanged = 
    currentTasks.name !== fetchedTask.name ||
    currentTasks.detail !== fetchedTask.detail ||
    currentTasks.status_id !== fetchedTask.status_id ||
    currentTasks.send_mail !== fetchedTask.send_mail

  return {
    register,
    errors,
    setValue,
    watch,
    isValueChanged,
    setForm: reset,
    handleSubmit,
    fetchedTask,
    refresh: mutate,
    isLoading
  }
}

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import useSWR from "swr"
import { fetchTask } from "../../../_query/taskQuery"
import { useEffect, useState } from "react"
import { TaskFormSchema, TaskFormType } from "../_schema/taskFormSchema"
import { isSameArray } from "@/app/(shared)/util"

/** タスクフォームを取得する */
export const useTaskForm = ({id}: {id: number}) => {

  /** タスクフォームのデフォルト値 */
  const defaultTask: TaskFormType = {
    name: "",
    icon: "",
    tags: [],
  }

  // タスクフォームの状態を作成する
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<TaskFormType>({
    resolver: zodResolver(TaskFormSchema),
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
      // タスクフォームに変換する
      const fetchedTaskForm: TaskFormType = {
        name: taskEntity.name,
        icon: taskEntity.icon,
        tags: taskEntity.task_tags.map((t) => t.name),
      }
      setFetchedTask(fetchedTaskForm)
      reset(fetchedTaskForm)
    }
  }, [taskEntity])

  /** 現在の入力データ */
  const currentTasks = watch()

  /** 値を変更したかどうか */
  const isValueChanged = 
    currentTasks.name !== fetchedTask.name ||
    currentTasks.icon !== fetchedTask.icon ||
    !isSameArray(currentTasks.tags, fetchedTask.tags)

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
    isLoading,
    entity: taskEntity
  }
}

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import useSWR from "swr"
import { fetchQuest } from "../../../../api/children/_query/questQuery"
import { useEffect, useState } from "react"
import { QuestFormSchema, QuestFormType } from "../_schema/childFormSchema"
import { isSameArray } from "@/app/(core)/util"

/** クエストフォームを取得する */
export const useQuestForm = ({id}: {id: number}) => {

  /** クエストフォームのデフォルト値 */
  const defaultQuest: QuestFormType = {
    name: "",
    icon: "",
    tags: [],
  }

  // クエストフォームの状態を作成する
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<QuestFormType>({
    resolver: zodResolver(QuestFormSchema),
    defaultValues: defaultQuest
  })

  // IDに紐づくクエストを取得する
  const { data: questEntity, error, mutate, isLoading } = useSWR(
    id ? ["クエスト", id] : null,
    () => fetchQuest(id)
  )

  // エラーをチェックする
  if (error) throw error

  /** 取得時のクエストデータ */
  const [fetchedQuest, setFetchedQuest] = useState(defaultQuest)

  // クエストを取得できた場合、状態にセットする
  useEffect(() => {
    if (questEntity != null) {
      // クエストフォームに変換する
      const fetchedQuestForm: QuestFormType = {
        name: questEntity.name,
        icon: questEntity.icon,
        tags: questEntity.quest_tags.map((t) => t.name),
      }
      setFetchedQuest(fetchedQuestForm)
      reset(fetchedQuestForm)
    }
  }, [questEntity])

  /** 現在の入力データ */
  const currentQuests = watch()

  /** 値を変更したかどうか */
  const isValueChanged = 
    currentQuests.name !== fetchedQuest.name ||
    currentQuests.icon !== fetchedQuest.icon ||
    !isSameArray(currentQuests.tags, fetchedQuest.tags)

  return {
    register,
    errors,
    setValue,
    watch,
    isValueChanged,
    setForm: reset,
    handleSubmit,
    fetchedQuest,
    refresh: mutate,
    isLoading,
    entity: questEntity
  }
}

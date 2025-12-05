import { useQuery } from "@tanstack/react-query"
import { FamilyQuestFormSchema, FamilyQuestFormType } from "../form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { getFamilyQuest } from "@/app/api/quests/[id]/family/client"
import { useEffect, useState } from "react"

/** クエストフォームを取得する */
export const useFamilyQuestForm = ({questId}: {questId: number}) => {

  /** クエストフォームのデフォルト値 */
  const defaultQuest: FamilyQuestFormType = {
    name: "",
    icon: "",
    tags: [],
    isPublic: false
  }

  // クエストフォームの状態を作成する
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FamilyQuestFormType>({
    resolver: zodResolver(FamilyQuestFormSchema),
    defaultValues: defaultQuest
  })

  /** 取得時のクエストデータ */
  const [fetchedQuest, setFetchedQuest] = useState(defaultQuest)

  // IDに紐づくクエストを取得する
  const { error } = useQuery({
    queryKey: ["familyQuest", questId],
    retry: false,
    queryFn: async () => {
      const { quest } = await getFamilyQuest(questId)
      // クエストフォームに変換する
      const fetchedFamilyQuestForm: FamilyQuestFormType = {
        name: quest.name,
        icon: quest.icon,
        tags: quest.quest_tags.map((t) => t.name),
      }
      setFetchedQuest(fetchedFamilyQuestForm)
      reset(fetchedFamilyQuestForm)
    },
  })

  // エラーをチェックする
  if (error) throw error

  // クエストを取得できた場合、状態にセットする
  useEffect(() => {

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

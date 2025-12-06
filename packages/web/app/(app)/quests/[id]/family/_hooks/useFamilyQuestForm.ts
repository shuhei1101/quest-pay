import { useQuery } from "@tanstack/react-query"
import { FamilyQuestFormSchema, FamilyQuestFormType } from "../form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { getFamilyQuest } from "@/app/api/quests/[id]/family/client"
import { useState } from "react"
import { devLog, isSameArray } from "@/app/(core)/util"

/** クエストフォームを取得する */
export const useFamilyQuestForm = ({questId}: {questId?: number}) => {

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
  const { data, error, isLoading } = useQuery({
    queryKey: ["familyQuest", questId],
    retry: false,
    queryFn: async () => {
      const { quest } = await getFamilyQuest(questId!)
      devLog("useFamilyQuestForm.取得処理: ", quest)
      // クエストフォームに変換する
      const fetchedFamilyQuestForm: FamilyQuestFormType = {
        name: quest.name,
        icon: quest.icon,
        tags: quest.quest_tags.map((t) => t.name),
        isPublic: quest.is_public
      }
      // 取得フォームを状態にセットする
      setFetchedQuest(fetchedFamilyQuestForm)
      reset(fetchedFamilyQuestForm)

      // 取得データを返却する
      return {
        questEntity: quest
      }
    },
    enabled: !!questId
  })

  // エラーをチェックする
  if (error) throw error

  /** 現在の入力データ */
  const currentQuest = watch()

  /** 値を変更したかどうか */
  const isValueChanged = 
    currentQuest.name !== fetchedQuest.name ||
    currentQuest.icon !== fetchedQuest.icon ||
    !isSameArray(currentQuest.tags, fetchedQuest.tags) ||
    currentQuest.isPublic !== fetchedQuest.isPublic

  return {
    register,
    errors,
    setValue,
    watch,
    isValueChanged,
    setForm: reset,
    handleSubmit,
    fetchedQuest,
    fetchedEntity: data?.questEntity,
    isLoading
  }
}

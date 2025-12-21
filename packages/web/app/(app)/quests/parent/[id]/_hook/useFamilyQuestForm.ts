import { useQuery } from "@tanstack/react-query"
import { FamilyQuestFormScheme, FamilyQuestFormType } from "../form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { getFamilyQuest } from "@/app/api/quests/[id]/family/client"
import { useState } from "react"
import { devLog, isSameArray } from "@/app/(core)/util"
import { useMantineTheme } from "@mantine/core"
import { useRouter } from "next/navigation"
import { handleAppError } from "@/app/(core)/error/handler/client"

/** クエストフォームを取得する */
export const useFamilyQuestForm = ({questId}: {questId?: string}) => {
  const thema = useMantineTheme()
  const router = useRouter()

  /** クエストフォームのデフォルト値 */
  const defaultQuest: FamilyQuestFormType = {
    name: "",
    iconId: 1,
    tags: [],
    isPublic: false,
    iconColor: thema.colors.blue[ 5 ],
    categoryId: null,
    details: [{
        level: 1,
        successCondition: "",
        targetCount: 0,
        reward: 0,
        childExp: 0,
        questExp: 0,
        requiredExp: 0,
      }]
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
    resolver: zodResolver(FamilyQuestFormScheme),
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
        tags: quest.quest_tags.map( ( t ) => t.name ),
        iconId: quest.icon_id,
        isPublic: quest.is_public,
        iconColor: quest.icon_color,
        categoryId: quest.category_id,
        details: quest.quest_details.map(( detail ) => ({
          level: detail.level,
          successCondition: detail.success_condition,
          targetCount: detail.target_count,
          reward: detail.reward,
          childExp: detail.child_exp,
          questExp: detail.quest_exp,
          requiredExp: detail.required_exp,
        }))
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
  if (error) handleAppError(error, router)

  /** 現在の入力データ */
  const currentQuest = watch()

  /** 値を変更したかどうか */
  const isValueChanged = 
    currentQuest.name !== fetchedQuest.name ||
    currentQuest.iconId !== fetchedQuest.iconId ||
    currentQuest.iconColor !== fetchedQuest.iconColor ||
    !isSameArray(currentQuest.tags, fetchedQuest.tags) ||
    currentQuest.isPublic !== fetchedQuest.isPublic ||
    currentQuest.categoryId !== fetchedQuest.categoryId

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

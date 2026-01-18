import { useQuery } from "@tanstack/react-query"
import { FamilyQuestFormScheme, FamilyQuestFormType } from "../form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { getFamilyQuest } from "@/app/api/quests/family/[id]/client"
import { useState } from "react"
import { devLog, isSameArray } from "@/app/(core)/util"
import { useMantineTheme } from "@mantine/core"
import { useRouter } from "next/navigation"
import { handleAppError } from "@/app/(core)/error/handler/client"

/** クエストフォームを取得する */
export const useFamilyQuestForm = ({familyQuestId}: {familyQuestId?: string}) => {
  const thema = useMantineTheme()
  const router = useRouter()

  /** クエストフォームのデフォルト値 */
  const defaultQuest: FamilyQuestFormType = {
    name: "",
    iconId: 1,
    tags: [],
    iconColor: thema.colors.blue[ 5 ],
    categoryId: null,
    details: [ {
      level: 1,
      successCondition: "",
      requiredClearCount: 1,
      reward: 0,
      childExp: 0,
      requiredCompletionCount: 1,
    } ],
    ageFrom: null,
    ageTo: null,
    monthFrom: null,
    monthTo: null,
    client: "",
    requestDetail: "",
    childSettings: []
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
    queryKey: ["familyQuest", familyQuestId],
    retry: false,
    queryFn: async () => {
      const { familyQuest } = await getFamilyQuest({familyQuestId: familyQuestId!})
      devLog("useFamilyQuestForm.取得処理: ", familyQuest)
      // クエストフォームに変換する
      const fetchedFamilyQuestForm: FamilyQuestFormType = {
        name: familyQuest.quest.name || "",
        tags: familyQuest.tags?.map( ( t ) => t.name ),
        iconId: familyQuest.quest.iconId,
        iconColor: familyQuest.quest.iconColor,
        categoryId: familyQuest.quest.categoryId,
        details: familyQuest.details.map( ( detail ) => ( {
          level: detail.level,
          successCondition: detail.successCondition,
          requiredClearCount: detail.requiredClearCount,
          reward: detail.reward,
          childExp: detail.childExp,
          requiredCompletionCount: detail.requiredCompletionCount,
        } ) ),
        ageFrom: familyQuest.quest.ageFrom,
        ageTo: familyQuest.quest.ageTo,
        monthFrom: familyQuest.quest.monthFrom,
        monthTo: familyQuest.quest.monthTo,
        client: familyQuest.quest.client,
        requestDetail: familyQuest.quest.requestDetail,
        childSettings: familyQuest.children.map((child) => ({
          childId: child.childId,
          isActivate: child.isActivate ?? true,
          hasQuestChildren: true,
        })),
      }
      // 取得フォームを状態にセットする
      setFetchedQuest(fetchedFamilyQuestForm)
      reset(fetchedFamilyQuestForm)

      // 取得データを返却する
      return {
        questEntity: familyQuest
      }
    },
    staleTime: 0,
    refetchOnMount: "always",
    enabled: !!familyQuestId
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
    currentQuest.categoryId !== fetchedQuest.categoryId ||
    currentQuest.ageFrom !== fetchedQuest.ageFrom ||
    currentQuest.ageTo !== fetchedQuest.ageTo ||
    currentQuest.monthFrom !== fetchedQuest.monthFrom ||
    currentQuest.monthTo !== fetchedQuest.monthTo ||
    currentQuest.client !== fetchedQuest.client ||
    currentQuest.requestDetail !== fetchedQuest.requestDetail ||
    JSON.stringify(currentQuest.details) !== JSON.stringify(fetchedQuest.details) ||
    JSON.stringify(currentQuest.childSettings) !== JSON.stringify(fetchedQuest.childSettings)

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

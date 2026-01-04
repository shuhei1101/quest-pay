import { useQuery } from "@tanstack/react-query"
import { PublicQuestFormScheme, PublicQuestFormType } from "../form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { getPublicQuest } from "@/app/api/quests/public/[id]/client"
import { useState } from "react"
import { devLog, isSameArray } from "@/app/(core)/util"
import { useMantineTheme } from "@mantine/core"
import { useRouter } from "next/navigation"
import { handleAppError } from "@/app/(core)/error/handler/client"

/** クエストフォームを取得する */
export const usePublicQuestForm = ({publicQuestId}: {publicQuestId: string}) => {
  const thema = useMantineTheme()
  const router = useRouter()

  /** クエストフォームのデフォルト値 */
  const defaultQuest: PublicQuestFormType = {
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
  }

  // クエストフォームの状態を作成する
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PublicQuestFormType>({
    resolver: zodResolver(PublicQuestFormScheme),
    defaultValues: defaultQuest
  })
  /** 取得時のクエストデータ */
  const [fetchedQuest, setFetchedQuest] = useState(defaultQuest)

  // IDに紐づくクエストを取得する
  const { data, error, isLoading } = useQuery({
    queryKey: ["publicQuest", publicQuestId],
    retry: false,
    queryFn: async () => {
      const { publicQuest } = await getPublicQuest({publicQuestId: publicQuestId!})
      devLog("usePublicQuestForm.取得処理: ", publicQuest)
      // クエストフォームに変換する
      const fetchedPublicQuestForm: PublicQuestFormType = {
        name: publicQuest.quest.name || "",
        tags: publicQuest.tags?.map( ( t ) => t.name ),
        iconId: publicQuest.quest.iconId,
        iconColor: publicQuest.quest.iconColor,
        categoryId: publicQuest.quest.categoryId,
        details: publicQuest.details.map( ( detail ) => ( {
          level: detail.level,
          successCondition: detail.successCondition,
          requiredClearCount: detail.requiredClearCount,
          reward: detail.reward,
          childExp: detail.childExp,
          requiredCompletionCount: detail.requiredCompletionCount,
        } ) ),
        ageFrom: publicQuest.quest.ageFrom,
        ageTo: publicQuest.quest.ageTo,
        monthFrom: publicQuest.quest.monthFrom,
        monthTo: publicQuest.quest.monthTo,
        client: publicQuest.quest.client,
        requestDetail: publicQuest.quest.requestDetail,
      }
      // 取得フォームを状態にセットする
      setFetchedQuest(fetchedPublicQuestForm)
      reset(fetchedPublicQuestForm)

      // 取得データを返却する
      return {
        questEntity: publicQuest
      }
    },
    staleTime: 0,
    refetchOnMount: "always",
    enabled: !!publicQuestId
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
    JSON.stringify(currentQuest.details) !== JSON.stringify(fetchedQuest.details)

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

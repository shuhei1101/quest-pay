import { useQuery } from "@tanstack/react-query"
import { TemplateQuestFormScheme, TemplateQuestFormType } from "../form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { getTemplateQuest } from "@/app/api/quests/template/[id]/client"
import { useState } from "react"
import { devLog, isSameArray } from "@/app/(core)/util"
import { useMantineTheme } from "@mantine/core"
import { useRouter } from "next/navigation"
import { handleAppError } from "@/app/(core)/error/handler/client"

/** クエストフォームを取得する */
export const useTemplateQuestForm = ({templateQuestId}: {templateQuestId: string}) => {
  const thema = useMantineTheme()
  const router = useRouter()

  /** クエストフォームのデフォルト値 */
  const defaultQuest: TemplateQuestFormType = {
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
  } = useForm<TemplateQuestFormType>({
    resolver: zodResolver(TemplateQuestFormScheme),
    defaultValues: defaultQuest
  })
  /** 取得時のクエストデータ */
  const [fetchedQuest, setFetchedQuest] = useState(defaultQuest)

  // IDに紐づくクエストを取得する
  const { data, error, isLoading } = useQuery({
    queryKey: ["templateQuest", templateQuestId],
    retry: false,
    queryFn: async () => {
      const { templateQuest } = await getTemplateQuest({templateQuestId: templateQuestId!})
      devLog("useTemplateQuestForm.取得処理: ", templateQuest)
      // クエストフォームに変換する
      const fetchedTemplateQuestForm: TemplateQuestFormType = {
        name: templateQuest.quest.name || "",
        tags: templateQuest.tags?.map( ( t ) => t.name ),
        iconId: templateQuest.quest.iconId,
        iconColor: templateQuest.quest.iconColor,
        categoryId: templateQuest.quest.categoryId,
        details: templateQuest.details.map( ( detail ) => ( {
          level: detail.level,
          successCondition: detail.successCondition,
          requiredClearCount: detail.requiredClearCount,
          reward: detail.reward,
          childExp: detail.childExp,
          requiredCompletionCount: detail.requiredCompletionCount,
        } ) ),
        ageFrom: templateQuest.quest.ageFrom,
        ageTo: templateQuest.quest.ageTo,
        monthFrom: templateQuest.quest.monthFrom,
        monthTo: templateQuest.quest.monthTo,
        client: templateQuest.quest.client,
        requestDetail: templateQuest.quest.requestDetail,
      }
      // 取得フォームを状態にセットする
      setFetchedQuest(fetchedTemplateQuestForm)
      reset(fetchedTemplateQuestForm)

      // 取得データを返却する
      return {
        questEntity: templateQuest
      }
    },
    staleTime: 0,
    refetchOnMount: "always",
    enabled: !!templateQuestId
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

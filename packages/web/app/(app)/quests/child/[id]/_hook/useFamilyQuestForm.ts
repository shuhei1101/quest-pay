import { useQuery } from "@tanstack/react-query"
import { FamilyQuestFormSchema, FamilyQuestFormType } from "../form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { getFamilyQuest } from "@/app/api/quests/[id]/family/client"
import { useState } from "react"
import { devLog, isSameArray } from "@/app/(core)/util"
import { useMantineTheme } from "@mantine/core"
import { handleAppError } from "@/app/(core)/error/handler/client"
import { useRouter } from "next/navigation"

/** クエストフォームを取得する */
export const useFamilyQuestForm = ({questId}: {questId?: string}) => {
  const router = useRouter()
  try {
    const thema = useMantineTheme()

    /** クエストフォームのデフォルト値 */
    const defaultQuest: FamilyQuestFormType = {
      name: "",
      iconId: 1,
      tags: [],
      isPublic: false,
      iconColor: thema.colors.blue[ 5 ],
      categoryId: null
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
          tags: quest.quest_tags.map( ( t ) => t.name ),
          iconId: quest.icon_id,
          isPublic: quest.is_public,
          iconColor: quest.icon_color,
          categoryId: null
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
  } catch (error) {
    handleAppError(error, router)
  }
}

import { useQuery } from "@tanstack/react-query"
import { LevelRewardFormSchema, LevelRewardFormType } from "../form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { getFamilyLevelRewardTable } from "@/app/api/reward/by-level/table/client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { handleAppError } from "@/app/(core)/error/handler/client"

/** レベル別報酬フォームを取得する */
export const useLevelRewardForm = () => {
  const router = useRouter()

  /** レベル別報酬フォームのデフォルト値 */
  const defaultLevelReward: LevelRewardFormType = {
    rewards: []
  }

  // レベル別報酬フォームの状態を作成する
  const form = useForm<LevelRewardFormType>({
    resolver: zodResolver(LevelRewardFormSchema),
    defaultValues: defaultLevelReward
  })
  
  const { reset, watch } = form
  
  /** 取得時のレベル別報酬データ */
  const [fetchedLevelReward, setFetchedLevelReward] = useState(defaultLevelReward)

  // レベル別報酬テーブルを取得する
  const { data, error, isLoading } = useQuery({
    queryKey: ["levelRewardTable"],
    queryFn: async () => {
      const { levelRewardTable } = await getFamilyLevelRewardTable()
      
      // レベル別報酬フォームに変換する
      const fetchedLevelRewardForm: LevelRewardFormType = {
        rewards: levelRewardTable.rewards
      }
      
      // 取得フォームを状態にセットする
      setFetchedLevelReward(fetchedLevelRewardForm)
      reset(fetchedLevelRewardForm)

      // 取得データを返却する
      return {
        levelRewardEntity: levelRewardTable
      }
    },
    staleTime: 0,
    refetchOnMount: "always"
  })

  // エラーをチェックする
  if (error) handleAppError(error, router)

  /** 現在の入力データ */
  const currentLevelReward = watch()

  /** 値を変更したかどうか */
  const isValueChanged = JSON.stringify(currentLevelReward) !== JSON.stringify(fetchedLevelReward)

  return {
    ...form,
    isValueChanged,
    setForm: reset,
    fetchedLevelReward,
    fetchedEntity: data?.levelRewardEntity,
    isLoading
  }
}

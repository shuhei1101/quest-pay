import { useQuery } from "@tanstack/react-query"
import { AgeRewardFormSchema, AgeRewardFormType } from "../form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { getFamilyAgeRewardTable } from "@/app/api/reward/by-age/table/client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { handleAppError } from "@/app/(core)/error/handler/client"

/** 年齢別報酬フォームを取得する */
export const useAgeRewardForm = () => {
  const router = useRouter()

  /** 年齢別報酬フォームのデフォルト値 */
  const defaultAgeReward: AgeRewardFormType = {
    rewards: []
  }

  // 年齢別報酬フォームの状態を作成する
  const form = useForm<AgeRewardFormType>({
    resolver: zodResolver(AgeRewardFormSchema),
    defaultValues: defaultAgeReward
  })
  
  const { reset, watch } = form
  
  /** 取得時の年齢別報酬データ */
  const [fetchedAgeReward, setFetchedAgeReward] = useState(defaultAgeReward)

  // 年齢別報酬テーブルを取得する
  const { data, error, isLoading } = useQuery({
    queryKey: ["ageRewardTable"],
    queryFn: async () => {
      const { ageRewardTable } = await getFamilyAgeRewardTable()
      
      // 年齢別報酬フォームに変換する
      const fetchedAgeRewardForm: AgeRewardFormType = {
        rewards: ageRewardTable.rewards
      }
      
      // 取得フォームを状態にセットする
      setFetchedAgeReward(fetchedAgeRewardForm)
      reset(fetchedAgeRewardForm)

      // 取得データを返却する
      return {
        ageRewardEntity: ageRewardTable
      }
    },
    staleTime: 0,
    refetchOnMount: "always"
  })

  // エラーをチェックする
  if (error) handleAppError(error, router)

  /** 現在の入力データ */
  const currentAgeReward = watch()

  /** 値を変更したかどうか */
  const isValueChanged = JSON.stringify(currentAgeReward) !== JSON.stringify(fetchedAgeReward)

  return {
    ...form,
    isValueChanged,
    setForm: reset,
    fetchedAgeReward,
    fetchedEntity: data?.ageRewardEntity,
    isLoading
  }
}

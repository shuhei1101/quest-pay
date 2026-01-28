import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AgeRewardFormSchema, AgeRewardFormType, LevelRewardFormSchema, LevelRewardFormType } from "../form"
import { putFamilyAgeRewardTable } from "@/app/api/reward/by-age/table/client"
import { putFamilyLevelRewardTable } from "@/app/api/reward/by-level/table/client"
import { useRouter } from "next/navigation"
import { REWARD_VIEW_URL } from "@/app/(core)/endpoints"
import toast from "react-hot-toast"

/** 年齢別報酬フォームを取得する */
export const useAgeRewardForm = ({ defaultValues }: { defaultValues: AgeRewardFormType }) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  // フォームの状態を作成する
  const form = useForm<AgeRewardFormType>({
    resolver: zodResolver(AgeRewardFormSchema),
    defaultValues
  })

  // 更新処理
  const mutation = useMutation({
    mutationFn: async (data: AgeRewardFormType) => await putFamilyAgeRewardTable(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ageRewardTable"] })
      toast.success("定額報酬を更新しました")
      router.push(REWARD_VIEW_URL)
    },
    onError: () => {
      toast.error("定額報酬の更新に失敗しました")
    }
  })

  /** 現在の入力データ */
  const current = form.watch()

  /** 値を変更したかどうか */
  const isValueChanged = JSON.stringify(current) !== JSON.stringify(defaultValues)

  return {
    ...form,
    isValueChanged,
    mutation
  }
}

/** レベル別報酬フォームを取得する */
export const useLevelRewardForm = ({ defaultValues }: { defaultValues: LevelRewardFormType }) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  // フォームの状態を作成する
  const form = useForm<LevelRewardFormType>({
    resolver: zodResolver(LevelRewardFormSchema),
    defaultValues
  })

  // 更新処理
  const mutation = useMutation({
    mutationFn: async (data: LevelRewardFormType) => await putFamilyLevelRewardTable(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["levelRewardTable"] })
      toast.success("ランク報酬を更新しました")
      router.push(REWARD_VIEW_URL)
    },
    onError: () => {
      toast.error("ランク報酬の更新に失敗しました")
    }
  })

  /** 現在の入力データ */
  const current = form.watch()

  /** 値を変更したかどうか */
  const isValueChanged = JSON.stringify(current) !== JSON.stringify(defaultValues)

  return {
    ...form,
    isValueChanged,
    mutation
  }
}

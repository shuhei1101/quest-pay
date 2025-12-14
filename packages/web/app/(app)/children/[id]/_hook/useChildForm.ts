"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChildFormSchema, ChildFormType } from "../form"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { devLog } from "@/app/(core)/util"
import { getChild } from "@/app/api/users/child/[id]/client"
import { useRouter } from "next/navigation"
import { handleAppError } from "@/app/(core)/error/handler/client"

/** 子供登録フォームを取得する */
export const useChildForm = ({childId}: {childId?: string}) => {
  const router = useRouter()
  /** 子供登録フォームのデフォルト値 */
  const defaultChild: ChildFormType = {
    name: "",
    iconId: 1,
    iconColor: "",
    birthday: ""
  }

  // 子供登録フォームの状態を作成する
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ChildFormType>({
    resolver: zodResolver(ChildFormSchema),
    defaultValues: defaultChild
  })

  /** 取得時の子供データ */
  const [fetchedChild, setFetchedChild] = useState(defaultChild)

  // IDに紐づく子供を取得する
  const { data, error, isLoading } = useQuery({
    queryKey: ["Child", childId],
    retry: false,
    queryFn: async () => {
      const { user } = await getChild(childId!)
      devLog("useChildForm.取得処理: ", user)

      if (!user) return {}

      // 子供フォームに変換する
      const fetchedChildForm: ChildFormType = {
        name: user?.profile_name,
        iconId: user?.profile_icon_id,
        iconColor: user.profile_icon_color,
        birthday: user.profile_birthday
      }
      // 取得フォームを状態にセットする
      setFetchedChild(fetchedChildForm)
      reset(fetchedChildForm)

      // 取得データを返却する
      return {
        userEntity: user
      }
    },
    enabled: !!childId
  })

  // エラーをチェックする
  if (error) handleAppError(error, router)

  /** 現在の入力データ */
  const current = watch()

  /** 値を変更したかどうか */
  const isValueChanged = 
    current.name !== fetchedChild.name ||
    current.birthday !== fetchedChild.birthday ||
    current.iconColor !== fetchedChild.iconColor ||
    current.iconId !== fetchedChild.iconId

  devLog("useChildForm.フォーム: ", current)
  devLog("useChildForm.エンティティ: ", data?.userEntity)


  return {
    register,
    errors,
    setValue,
    watch,
    isValueChanged,
    setForm: reset,
    handleSubmit,
    isLoading,
    fetchedChild,
    fetchedEntity: data?.userEntity,
  }
}

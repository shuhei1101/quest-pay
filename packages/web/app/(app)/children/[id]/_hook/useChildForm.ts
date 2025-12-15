"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChildFormScheme, ChildFormType } from "../form"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { devLog } from "@/app/(core)/util"
import { useRouter } from "next/navigation"
import { getChild } from "@/app/api/children/[id]/client"
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
    resolver: zodResolver(ChildFormScheme),
    defaultValues: defaultChild
  })

  /** 取得時の子供データ */
  const [fetchedChild, setFetchedChild] = useState(defaultChild)

  // IDに紐づく子供を取得する
  const { data, error, isLoading } = useQuery({
    queryKey: ["Child", childId],
    retry: false,
    queryFn: async () => {
      const { child } = await getChild(childId!)
      devLog("useChildForm.取得処理: ", child)

      if (!child) return {}

      // 子供フォームに変換する
      const fetchedChildForm: ChildFormType = {
        name: child.name,
        iconId: child.icon_id,
        iconColor: child.icon_color,
        birthday: child.birthday
      }
      // 取得フォームを状態にセットする
      setFetchedChild(fetchedChildForm)
      reset(fetchedChildForm)

      // 取得データを返却する
      return {
        childEntity: child
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
  devLog("useChildForm.エンティティ: ", data?.childEntity)


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
    fetchedEntity: data?.childEntity,
  }
}

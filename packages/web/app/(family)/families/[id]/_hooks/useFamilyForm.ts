import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createFamilySchemaFromEntity, RawFamily, FamilyFormSchema, familyFormSchema } from "../../../_schema/familySchema"
import useSWR from "swr"
import { fetchFamily } from "../../../_query/familyQuery"
import { useEffect, useState } from "react"

/** 家族フォームを取得する */
export const useFamilyForm = ({id}: {id: number}) => {

  /** 家族フォームのデフォルト値 */
  const defaultFamily: FamilyFormSchema = {
    id: 0,
    name: "",
    detail: "",
    status_id: undefined,
    send_mail: false,
    created_at: undefined,
    updated_at: undefined
  }

  // 家族フォームの状態を作成する
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FamilyFormSchema>({
    resolver: zodResolver(familyFormSchema),
    defaultValues: defaultFamily
  })

  // IDに紐づく家族を取得する
  const { data: familyEntity, error, mutate, isLoading } = useSWR(
    id ? ["家族", id] : null,
    () => fetchFamily(id)
  )

  // エラーをチェックする
  if (error) throw error

  /** 取得時の家族データ */
  const [fetchedFamily, setFetchedFamily] = useState(defaultFamily)

  // 家族を取得できた場合、状態にセットする
  useEffect(() => {
    if (familyEntity != null) {
      const schemaFamily = createFamilySchemaFromEntity(familyEntity)
      setFetchedFamily(schemaFamily)
      reset(schemaFamily)
    }
  }, [familyEntity])

  /** 現在の入力データ */
  const currentFamilys = watch()

  /** 値を変更したかどうか */
  const isValueChanged = 
    currentFamilys.name !== fetchedFamily.name ||
    currentFamilys.detail !== fetchedFamily.detail ||
    currentFamilys.status_id !== fetchedFamily.status_id ||
    currentFamilys.send_mail !== fetchedFamily.send_mail

  return {
    register,
    errors,
    setValue,
    watch,
    isValueChanged,
    setForm: reset,
    handleSubmit,
    fetchedFamily,
    refresh: mutate,
    isLoading
  }
}

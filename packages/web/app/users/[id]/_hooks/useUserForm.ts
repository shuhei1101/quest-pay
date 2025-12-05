'use client'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createUserSchemaFromEntity, ProfileEntitySchema, UserFormSchema, userFormSchema } from "../../../api/users/entity"
import useSWR from "swr"
import { fetchProfile } from "../../../api/users/login/query"
import { useEffect, useState } from "react"

/** ユーザフォームを取得する */
export const useUserForm = ({id}: {id?: string}) => {

  /** ユーザフォームのデフォルト値 */
  const defaultUser: UserFormSchema = {
    name: "",
    type: 1,
    user_id: undefined,
    created_at: undefined,
    updated_at: undefined
  }

  // ユーザフォームの状態を作成する
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<UserFormSchema>({
    resolver: zodResolver(userFormSchema),
    defaultValues: defaultUser
  })

  // IDに紐づくユーザを取得する
  const { data: userEntity, error, mutate, isLoading } = useSWR(
    id ? ["ユーザ", id] : null,
    () => fetchProfile(id)
  )

  // エラーをチェックする
  if (error) throw error

  /** 取得時のユーザデータ */
  const [fetchedUser, setFetchedUser] = useState(defaultUser)

  // ユーザを取得できた場合、状態にセットする
  useEffect(() => {
    if (userEntity != null) {
      const schemaUser = createUserSchemaFromEntity(userEntity)
      setFetchedUser(schemaUser)
      reset(schemaUser)
    }
  }, [userEntity])

  /** 現在の入力データ */
  const currentUsers = watch()

  /** 値を変更したかどうか */
  const isValueChanged = 
    currentUsers.name !== fetchedUser.name ||
    currentUsers.type !== fetchedUser.type

  return {
    register,
    errors,
    setValue,
    watch,
    isValueChanged,
    setForm: reset,
    handleSubmit,
    fetchedUser,
    refresh: mutate,
    isLoading
  }
}

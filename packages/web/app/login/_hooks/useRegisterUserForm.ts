import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

/** ユーザフォームを取得する */
export const useProfileForm = () => {

  /** ユーザフォームのデフォルト値 */
  const defaultUser: ProfileFormSchema = {
    name: "",
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
  } = useForm<ProfileFormSchema>({
    resolver: zodResolver(userFormSchema),
    defaultValues: defaultUser
  })

  return {
    register,
    errors,
    setValue,
    watch,
    setForm: reset,
    handleSubmit,
  }
}

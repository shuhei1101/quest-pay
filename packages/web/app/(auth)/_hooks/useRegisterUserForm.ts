import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { userFormSchema, UserFormSchema } from "../../(user)/_schema/userSchema"

/** ユーザフォームを取得する */
export const useUserForm = () => {

  /** ユーザフォームのデフォルト値 */
  const defaultUser: UserFormSchema = {
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
  } = useForm<UserFormSchema>({
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

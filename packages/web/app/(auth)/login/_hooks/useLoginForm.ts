import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginFormSchema, loginFormSchema } from "../_schema/loginSchema"

/** ログインフォームを取得する */
export const useLoginForm = () => {

  /** ログインフォームのデフォルト値 */
  const defaultForm: LoginFormSchema = {
    email: "",
    password: "",
  }

  // ログインフォームの状態を作成する
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: defaultForm
  })

  /** 現在の入力データ */
  const currentTasks = watch()

  /** 値を変更したかどうか */
  const isValueChanged = 
    currentTasks.email !== defaultForm.email ||
    currentTasks.password !== defaultForm.password

  return {
    register,
    errors,
    setValue,
    watch,
    isValueChanged,
    setForm: reset,
    handleSubmit,
  }
}

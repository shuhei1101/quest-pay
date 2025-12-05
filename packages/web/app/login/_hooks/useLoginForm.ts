import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginFormSchema, LoginFormType } from "../_schema/loginSchema"

/** ログインフォームを取得する */
export const useLoginForm = () => {

  /** ログインフォームのデフォルト値 */
  const defaultForm: LoginFormType = {
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
  } = useForm<LoginFormType>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: defaultForm
  })

  /** 現在の入力データ */
  const currentQuests = watch()

  /** 値を変更したかどうか */
  const isValueChanged = 
    currentQuests.email !== defaultForm.email ||
    currentQuests.password !== defaultForm.password

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

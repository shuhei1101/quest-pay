import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FamilyInviteSchema, FamilyInviteType } from "../form"

/** ログインフォームを取得する */
export const useFamilyInviteForm = () => {

  /** ログインフォームのデフォルト値 */
  const defaultForm: FamilyInviteType = {
    email: "",
  }

  // ログインフォームの状態を作成する
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FamilyInviteType>({
    resolver: zodResolver(FamilyInviteSchema),
    defaultValues: defaultForm
  })

  /** 現在の入力データ */
  const currentQuests = watch()

  /** 値を変更したかどうか */
  const isValueChanged = 
    currentQuests.email !== defaultForm.email

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

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FamilyRegisterFormSchema, FamilyRegisterFormType } from "../form"
import { useMantineTheme } from "@mantine/core"

/** 家族フォームを取得する */
export const useFamilyRegisterForm = () => {
  const thema = useMantineTheme()

  /** 家族フォームのデフォルト値 */
  const defaultFamily: FamilyRegisterFormType = {
    displayId: "",
    localName: "",
    parentName: "",
    parentIconId: 1,
    parentBirthday: "",
    onlineName: null,
    familyIconId: 1,
    familyIconColor: thema.colors.blue[5],
    parentIconColor: thema.colors.blue[5]
  }

  // 家族フォームの状態を作成する
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FamilyRegisterFormType>({
    resolver: zodResolver(FamilyRegisterFormSchema),
    defaultValues: defaultFamily
  })

  /** 現在の入力データ */
  const current = watch()

  /** 値を変更したかどうか */
  const isValueChanged = 
    current.displayId !== defaultFamily.displayId

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

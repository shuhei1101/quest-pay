import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FamilyCreateFormSchema, FamilyCreateForm } from "../_schema/familyCreateFormSchema"

/** 家族作成フォームを取得する */
export const useFamilyCreateForm = () => {

  /** 家族フォームのデフォルト値 */
  const defaultFamily: FamilyCreateForm = {
    displayId: "",
    localName: "",
    parentName: "",
    parentBirthday: "",
    familyIcon: "",
    parentIcon: "",
  }

  // 家族フォームの状態を作成する
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FamilyCreateForm>({
    resolver: zodResolver(FamilyCreateFormSchema),
    defaultValues: defaultFamily
  })

  /** 現在の入力データ */
  const currentFamilys = watch()

  /** 値を変更したかどうか */
  const isValueChanged = 
    currentFamilys.displayId !== defaultFamily.displayId ||
    currentFamilys.localName !== defaultFamily.localName ||
    currentFamilys.onlineName !== defaultFamily.onlineName ||
    currentFamilys.familyIcon !== defaultFamily.familyIcon ||
    currentFamilys.parentName !== defaultFamily.parentName ||
    currentFamilys.parentIcon !== defaultFamily.parentIcon

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

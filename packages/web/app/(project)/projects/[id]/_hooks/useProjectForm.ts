import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FetchProjectResult } from "../../../_query/projectQuery"
import { useEffect, useState } from "react"
import { projectFormSchema, ProjectFormSchema } from "@/app/(project)/_schema/projectSchema"
import { UserEntitySchema } from "@/app/(user)/_schema/userSchema"

/** プロジェクトフォームを取得する */
export const useProjectForm = ({fetchedProject, fetchedMembers}: {fetchedProject?: FetchProjectResult, fetchedMembers: UserEntitySchema[]}) => {

  /** プロジェクトフォームのデフォルト値 */
  const defaultProject: ProjectFormSchema = {
    id: 0,
    name: "",
    detail: "",
    is_public: false,
    members: [],
    created_at: undefined,
    updated_at: undefined
  }

  // プロジェクトフォームの状態を作成する
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ProjectFormSchema>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: defaultProject
  })

  /** 値を変更したかどうか */
  const [isValueChanged, setIsValueChanged] = useState<boolean>(false)
  
  /** 初期化済みフラグ */
  const [isInitialized, setIsInitialized] = useState<boolean>(false)

  // 既存のプロジェクトが存在する場合、状態にセットする（一度だけ）
  useEffect(() => {
    if (fetchedProject && !isInitialized) {
      const schemaProject: ProjectFormSchema = {
        id: fetchedProject.id,
        name: fetchedProject.name,
        detail: fetchedProject.detail,
        is_public: fetchedProject.is_public,
        created_at: fetchedProject.created_at,
        updated_at: fetchedProject.updated_at,
        members: fetchedMembers,
      }
      reset(schemaProject)
      setIsInitialized(true)
    }
  }, [fetchedProject, fetchedMembers, isInitialized, reset])

  // フォームの変更状態を監視
  useEffect(() => {
    if (fetchedProject && isInitialized) {
      /** 現在の入力データ */
      const currentProjects = watch()

      /** メンバーの変更チェック */
      const isMembersChanged = () => {
        const currentIds = (currentProjects.members || []).map(m => m.user_id).sort().join(',')
        const originalIds = fetchedMembers.map(m => m.user_id).sort().join(',')
        
        return currentIds !== originalIds
      }
      
      /** 値を変更したかどうか */
      setIsValueChanged(
        currentProjects.name !== fetchedProject.name ||
        currentProjects.detail !== fetchedProject.detail ||
        currentProjects.is_public !== fetchedProject.is_public ||
        isMembersChanged()
      )
    }
  }, [watch(), fetchedProject, fetchedMembers, isInitialized])


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

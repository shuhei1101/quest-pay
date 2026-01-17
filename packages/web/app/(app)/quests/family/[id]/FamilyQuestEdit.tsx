"use client"

import { useEffect, useState } from "react"
import { DetailSettings } from "./_components/DetailSettings"
import { BasicSettings } from "./_components/BasicSettings"
import { ChildSettings, FormWithChildSettings } from "./_components/ChildSettings"
import { useFamilyQuestForm } from "./_hooks/useFamilyQuestForm"
import { useRegisterFamilyQuest } from "./_hooks/useRegisterFamilyQuest"
import { useUpdateFamilyQuest } from "./_hooks/useUpdateFamilyQuest"
import { useDeleteFamilyQuest } from "./_hooks/useDeleteFamilyQuest"
import { useDisclosure } from "@mantine/hooks"
import { IconSelectPopup } from "@/app/(app)/icons/_components/IconSelectPopup"
import { useRouter } from "next/navigation"
import { FAMILY_QUEST_VIEW_URL, PUBLIC_QUEST_EDIT_URL, PUBLIC_QUEST_URL } from "@/app/(core)/endpoints"
import { usePublishFamilyQuest } from "./_hooks/usePublishFamilyQuest"
import { QuestEditLayout } from "../../_components/QuestEditLayout"
import { FamilyQuestFormType } from "./form"
import { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from "react-hook-form"
import { BaseQuestFormType } from "../../form"
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { usePublicQuest } from "./_hooks/usePublicQuest"

/** 家族クエスト編集コンポーネント */
export const FamilyQuestEdit = ({ id }: { id?: string }) => {
  const router = useRouter()

  /** 家族クエストID */
  const [familyQuestId, setFamilyQuestId] = useState<string | undefined>(id)

  /** アイコン選択ポップアップ制御状態 */
  const [iconPopupOpened, { open: openIconPopup, close: closeIconPopup }] = useDisclosure(false)

  /** ハンドラ */
  const { handleDelete, isLoading: deleteLoading } = useDeleteFamilyQuest()
  const { handlePublish } = usePublishFamilyQuest()
  const { handleRegister, isLoading: registerLoading } = useRegisterFamilyQuest({ setId: setFamilyQuestId })
  const { handleUpdate, isLoading: updateLoading } = useUpdateFamilyQuest()

  /** 更新中のローダ状態 */
  const [submitLoading, setSubmitLoading] = useState(false)
  useEffect(() => {
    setSubmitLoading(deleteLoading || registerLoading || updateLoading)
  }, [deleteLoading, registerLoading, updateLoading])

  /** 家族クエストフォームを取得する */
  const { register, setForm, errors, setValue, watch, isValueChanged, handleSubmit, isLoading: questLoading, fetchedEntity } = useFamilyQuestForm({ familyQuestId })

  /** 家族クエストIDに紐づく公開クエスト */
  const {publicQuest} = usePublicQuest({ familyQuestId: familyQuestId! })

  /** 起動時のハンドル */
  useEffect(() => {
    // セッションストレージから家族クエストフォームの初期値を取得する
    const form = appStorage.familyQuestForm.pop()
    if (form) {
      // 取得できた場合、フォームにセットする
      setForm(form)
    }
  }, [])

  /** アクティブレベル */
  const [activeLevel, setActiveLevel] = useState<string | null>(() => {
    const details = watch().details
    if (details && details.length > 0) {
      return details[0].level.toString()
    }
    return "1"
  })

  /** エンティティ取得時のハンドル */
  useEffect(() => {
    if (fetchedEntity?.base.id) {
      setFamilyQuestId(fetchedEntity.base.id)
    }
  }, [fetchedEntity])

  /** タグ入力状態 */
  const [tagInputValue, setTagInputValue] = useState("")

  /** IME入力状態 */
  const [isComposing, setIsComposing] = useState(false)

  /** レベル別の保存状態 */
  const [levels, setLevels] = useState<Record<string, boolean>>({
    "1": false,
    "2": false,
    "3": false,
    "4": false,
    "5": false,
  })

  /** レベル保存ハンドル */
  const handleLevelSave = (level: string) => {
    setLevels(prev => ({ ...prev, [level]: true }))
    const nextLevel = (parseInt(level) + 1).toString()
    if (parseInt(nextLevel) <= 5) {
      setActiveLevel(nextLevel)
    }
  }

  /** タグ入力時のハンドル */
  const handleTag = () => {
    const newTag = tagInputValue.trim()
    if (newTag && !watch().tags.includes(newTag)) {
      setValue("tags", [...watch().tags, newTag])
    }
    setTagInputValue("")
  }

  /** フォーム送信ハンドル */
  const onSubmit = handleSubmit((form) => {
    if (familyQuestId) {
      handleUpdate({ form, familyQuestId, updatedAt: fetchedEntity?.base.updatedAt })
    } else {
      handleRegister({ form })
    }
  })

  /** 各タブのエラーチェックフラグ */
  const hasBasicErrors = !!(errors.name || errors.iconId || errors.iconColor || errors.categoryId || errors.tags || errors.client || errors.requestDetail || errors.ageFrom || errors.ageTo || errors.monthFrom || errors.monthTo)
  const hasDetailErrors = !!(errors.details)
  const hasChildErrors = !!(errors.childSettings)

  return (
    <QuestEditLayout<FamilyQuestFormType>
      questId={familyQuestId}
      isLoading={questLoading}
      onSubmit={onSubmit}
      tabs={[
        {
          value: "basic",
          label: "基本設定",
          hasErrors: hasBasicErrors,
          content: (
            <BasicSettings
              register={register as unknown as UseFormRegister<BaseQuestFormType>}
              errors={errors as unknown as FieldErrors<BaseQuestFormType>}
              setValue={setValue as unknown as UseFormSetValue<BaseQuestFormType>}
              watch={watch as unknown as UseFormWatch<BaseQuestFormType>}
              openIconPopup={openIconPopup}
              tagInputValue={tagInputValue}
              setTagInputValue={setTagInputValue}
              handleTag={handleTag}
              isComposing={isComposing}
              setIsComposing={setIsComposing}
            />
          ),
        },
        {
          value: "details",
          label: "詳細設定",
          hasErrors: hasDetailErrors,
          content: (
            <DetailSettings
              activeLevel={activeLevel}
              setActiveLevel={setActiveLevel}
              levels={levels}
              onSave={handleLevelSave}
              register={register as unknown as UseFormRegister<BaseQuestFormType>}
              errors={errors as unknown as FieldErrors<BaseQuestFormType>}
              setValue={setValue as unknown as UseFormSetValue<BaseQuestFormType>}
              watch={watch as unknown as UseFormWatch<BaseQuestFormType>}
            />
          ),
        },
        {
          value: "children",
          label: "子供設定",
          hasErrors: hasChildErrors,
          content: (
            <ChildSettings
              watch={watch as unknown as UseFormWatch<FormWithChildSettings>}
              setValue={setValue as unknown as UseFormSetValue<FormWithChildSettings>}
            />
          ),
        },
      ]}
      editActions={[
        publicQuest ? {
          label: "公開中のクエストを確認",
          onClick: () => router.push(PUBLIC_QUEST_URL(publicQuest!.id)),
        } : {
          label: "オンラインに公開",
          onClick: () => handlePublish({ familyQuestId: familyQuestId! }),
        },
        {
          label: "表示確認",
          onClick: () => router.push(FAMILY_QUEST_VIEW_URL(familyQuestId!)),
        },
        {
          label: "削除",
          color: "red.7",
          loading: submitLoading,
          onClick: () => handleDelete({ familyQuestId: familyQuestId!, updatedAt: fetchedEntity?.base.updatedAt }),
        },
        {
          label: "更新",
          type: "submit",
          loading: submitLoading,
          disabled: !isValueChanged,
        },
      ]}
      createActions={[
        {
          label: "登録",
          type: "submit",
          loading: submitLoading,
        },
      ]}
      popups={
        <IconSelectPopup
          opened={iconPopupOpened}
          close={closeIconPopup}
          setIcon={(iconId) => setValue("iconId", iconId)}
          setColor={(iconColor) => setValue("iconColor", iconColor)}
          currentIconId={watch().iconId}
          currentColor={watch().iconColor}
        />
      }
    />
  )
}

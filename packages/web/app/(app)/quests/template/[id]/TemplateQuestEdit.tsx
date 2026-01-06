"use client"

import { useEffect, useState } from "react"
import { useTemplateQuestForm } from "./_hooks/useTemplateQuestForm"
import { useUpdateTemplateQuest } from "./_hooks/useUpdateTemplateQuest"
import { useDeleteTemplateQuest } from "./_hooks/useDeleteTemplateQuest"
import { useDisclosure } from "@mantine/hooks"
import { IconSelectPopup } from "@/app/(app)/icons/_components/IconSelectPopup"
import { QuestEditLayout } from "../../_components/QuestEditLayout"
import { TemplateQuestFormType } from "./form"
import { BasicSettings } from "../../family/[id]/_components/BasicSettings"
import { DetailSettings } from "../../family/[id]/_components/DetailSettings"

/** テンプレートクエスト編集コンポーネント */
export const TemplateQuestEdit = ({ id }: { id: string }) => {
  /** テンプレートクエストID */
  const [templateQuestId, setTemplateQuestId] = useState(id)

  /** アイコン選択ポップアップ制御状態 */
  const [iconPopupOpened, { open: openIconPopup, close: closeIconPopup }] = useDisclosure(false)

  const { handleDelete, isLoading: deleteLoading } = useDeleteTemplateQuest()
  const { handleUpdate, isLoading: updateLoading } = useUpdateTemplateQuest()

  /** 更新中のローダ状態 */
  const [submitLoading, setSubmitLoading] = useState(false)
  useEffect(() => {
    setSubmitLoading(deleteLoading || updateLoading)
  }, [deleteLoading, updateLoading])

  /** テンプレートクエストフォームを取得する */
  const { register, errors, setValue, watch, isValueChanged, handleSubmit, isLoading: questLoading, fetchedEntity } = useTemplateQuestForm({ templateQuestId })

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
      setTemplateQuestId(fetchedEntity.base.id)
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
    handleUpdate({ form, templateQuestId, updatedAt: fetchedEntity?.base.updatedAt })
  })

  /** 各タブのエラーチェックフラグ */
  const hasBasicErrors = !!(errors.name || errors.iconId || errors.iconColor || errors.categoryId || errors.tags || errors.client || errors.requestDetail || errors.ageFrom || errors.ageTo || errors.monthFrom || errors.monthTo)
  const hasDetailErrors = !!(errors.details)

  return (
    <QuestEditLayout<TemplateQuestFormType>
      questId={templateQuestId}
      isLoading={questLoading}
      onSubmit={onSubmit}
      tabs={[
        {
          value: "basic",
          label: "基本設定",
          hasErrors: hasBasicErrors,
          content: (
            <BasicSettings
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
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
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
            />
          ),
        },
      ]}
      editActions={[
        // 削除ボタン
        {
          label: "削除",
          color: "red.7",
          loading: submitLoading,
          onClick: () => handleDelete({ templateQuestId: templateQuestId!, updatedAt: fetchedEntity?.base.updatedAt }),
        },
        // 更新ボタン
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

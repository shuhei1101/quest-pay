"use client"

import { useEffect, useState } from "react"
import { usePublicQuestForm } from "./_hooks/usePublicQuestForm"
import { useUpdatePublicQuest } from "./_hooks/useUpdatePublicQuest"
import { useDeletePublicQuest } from "./_hooks/useDeletePublicQuest"
import { useDisclosure } from "@mantine/hooks"
import { IconSelectPopup } from "@/app/(app)/icons/_components/IconSelectPopup"
import { useRouter } from "next/navigation"
import { QuestEditLayout } from "../../_components/QuestEditLayout"
import { PublicQuestFormType } from "./form"
import { BasicSettings } from "../../family/[id]/_components/BasicSettings"
import { DetailSettings } from "../../family/[id]/_components/DetailSettings"
import { useActivatePublicQuest } from "./_hooks/useActivatePublicQuest"
import { useDeactivatePublicQuest } from "./_hooks/useDeactivatePublicQuest"

/** 公開クエスト編集コンポーネント */
export const PublicQuestEdit = ({ id }: { id: string }) => {
  const router = useRouter()

  /** 公開クエストID */
  const [publicQuestId, setPublicQuestId] = useState(id)

  /** アイコン選択ポップアップ制御状態 */
  const [iconPopupOpened, { open: openIconPopup, close: closeIconPopup }] = useDisclosure(false)

  /** ハンドラ */
  const { handleActivate, isLoading: activateLoading } = useActivatePublicQuest()
  const { handleDeactivate, isLoading: deactivateLoading } = useDeactivatePublicQuest()
  const { handleDelete, isLoading: deleteLoading } = useDeletePublicQuest()
  const { handleUpdate, isLoading: updateLoading } = useUpdatePublicQuest()

  /** 更新中のローダ状態 */
  const [submitLoading, setSubmitLoading] = useState(false)
  useEffect(() => {
    setSubmitLoading(deleteLoading || updateLoading)
  }, [deleteLoading, updateLoading])

  /** 公開クエストフォームを取得する */
  const { register, errors, setValue, watch, isValueChanged, handleSubmit, isLoading: questLoading, fetchedEntity } = usePublicQuestForm({ publicQuestId })

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
      setPublicQuestId(fetchedEntity.base.id)
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
    handleUpdate({ form, publicQuestId, updatedAt: fetchedEntity?.base.updatedAt })
  })

  /** 各タブのエラーチェックフラグ */
  const hasBasicErrors = !!(errors.name || errors.iconId || errors.iconColor || errors.categoryId || errors.tags || errors.client || errors.requestDetail || errors.ageFrom || errors.ageTo || errors.monthFrom || errors.monthTo)
  const hasDetailErrors = !!(errors.details)

  return (
    <QuestEditLayout<PublicQuestFormType>
      questId={publicQuestId}
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
        fetchedEntity?.base.isActivate ? 
        {
          label: "非公開にする",
          color: "gray.7",
          loading: deactivateLoading,
          onClick: () => handleDeactivate({ publicQuestId: publicQuestId!, updatedAt: fetchedEntity?.base.updatedAt }),
        } : {
          label: "公開にする",
          color: "green.7",
          loading: activateLoading,
          onClick: () => handleActivate({ publicQuestId: publicQuestId!, updatedAt: fetchedEntity?.base.updatedAt }),
        },
        {
          label: "削除",
          color: "red.7",
          loading: submitLoading,
          onClick: () => handleDelete({ publicQuestId: publicQuestId!, updatedAt: fetchedEntity?.base.updatedAt }),
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

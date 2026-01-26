"use client"

import { useEffect, useState } from "react"
import { usePublicQuestForm } from "./_hooks/usePublicQuestForm"
import { useUpdatePublicQuest } from "./_hooks/useUpdatePublicQuest"
import { useDeletePublicQuest } from "./_hooks/useDeletePublicQuest"
import { useDisclosure } from "@mantine/hooks"
import { IconSelectPopup } from "@/app/(app)/icons/_components/IconSelectPopup"
import { QuestEditLayout } from "../../_components/QuestEditLayout"
import { PublicQuestFormType } from "./form"
import { BasicSettings } from "../../family/[id]/_components/BasicSettings"
import { DetailSettings } from "../../family/[id]/_components/DetailSettings"
import { useActivatePublicQuest } from "./_hooks/useActivatePublicQuest"
import { useDeactivatePublicQuest } from "./_hooks/useDeactivatePublicQuest"
import { FAMILY_QUEST_VIEW_URL } from "@/app/(core)/endpoints"
import { useRouter } from "next/navigation"
import { DeleteIconButton } from "@/app/(core)/_components/DeleteIconButton"
import { SaveIconButton } from "@/app/(core)/_components/SaveIconButton"
import { PublishIconButton } from "@/app/(core)/_components/PublishIconButton"
import { UnpublishIconButton } from "@/app/(core)/_components/UnpublishIconButton"
import { CheckOriginalIconButton } from "@/app/(core)/_components/CheckOriginalIconButton"

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

  /** 元のクエスト確認ボタン */
  const handleCheckOriginalQuest = () => {
    if (isValueChanged) if (!confirm("変更内容が保存されていません。移動してもよろしいですか？")) return
    router.push(FAMILY_QUEST_VIEW_URL(fetchedEntity?.familyQuest?.id || ""))
  }

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
        <CheckOriginalIconButton
          key="check-original"
          onClick={handleCheckOriginalQuest}
        />,
        fetchedEntity?.base.isActivate ? (
          <UnpublishIconButton
            key="unpublish"
            loading={deactivateLoading}
            onClick={() => handleDeactivate({ publicQuestId: publicQuestId!, updatedAt: fetchedEntity?.base.updatedAt })}
          />
        ) : (
          <PublishIconButton
            key="publish"
            loading={activateLoading}
            onClick={() => handleActivate({ publicQuestId: publicQuestId!, updatedAt: fetchedEntity?.base.updatedAt })}
            tooltip="公開にする"
          />
        ),
        <DeleteIconButton
          key="delete"
          loading={submitLoading}
          onClick={() => handleDelete({ publicQuestId: publicQuestId!, updatedAt: fetchedEntity?.base.updatedAt })}
        />,
        <SaveIconButton
          key="save"
          type="submit"
          loading={submitLoading}
          disabled={!isValueChanged}
          tooltip="更新"
        />,
      ]}
      createActions={[
        <SaveIconButton
          key="save"
          type="submit"
          loading={submitLoading}
          tooltip="登録"
        />,
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

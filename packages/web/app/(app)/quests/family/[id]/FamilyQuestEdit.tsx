"use client"

import { Box, Button, Group, LoadingOverlay, Paper, Tabs } from "@mantine/core"
import { useEffect, useState } from "react"
import { DetailSettings } from "./_components/DetailSettings"
import { BasicSettings } from "./_components/BasicSettings"
import { OnlineSettings } from "./_components/OnlineSettings"
import { ChildSettings } from "./_components/ChildSettings"
import { useFamilyQuestForm } from "./_hook/useFamilyQuestForm"
import { useRegisterFamilyQuest } from "./_hook/useRegisterFamilyQuest"
import { useUpdateFamilyQuest } from "./_hook/useUpdateFamilyQuest"
import { useDeleteFamilyQuest } from "./_hook/useDeleteFamilyQuest"
import { useDisclosure } from "@mantine/hooks"
import { IconSelectPopup } from "@/app/(app)/icons/_components/IconSelectPopup"
import { IconAlertCircle } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { FAMILY_QUEST_VIEW_URL } from "@/app/(core)/endpoints"
import { usePublishFamilyQuest } from "./_hook/usePublishFamilyQuest"

export const FamilyQuestEdit = ({id}: {id?: string}) => {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<string | null>("basic")

  /** 家族クエストID */
  const [familyQuestId, setFamilyQuestId] = useState<string | undefined>(id)

  /** アイコン選択ポップアップ制御状態 */
  const [iconPopupOpened, { open: openIconPopup, close: closeIconPopup }] = useDisclosure(false)

  /** ハンドラ */
  const { handleDelete, isLoading: deleteLoading } = useDeleteFamilyQuest()
  const { handlePublish, isLoading: publishLoading } = usePublishFamilyQuest()
  const { handleRegister, isLoading: registerLoading } = useRegisterFamilyQuest({setId: setFamilyQuestId})
  const { handleUpdate, isLoading: updateLoading } = useUpdateFamilyQuest()

  /** 更新中のローダ状態 */
  const [submitLoading, setSubmitLoading] = useState(false)
  useEffect(() => {
    setSubmitLoading(deleteLoading || registerLoading || updateLoading)
  }, [deleteLoading, registerLoading, updateLoading])

  /** 家族クエストフォームを取得する */
  const { register, errors, setValue, watch, isValueChanged, handleSubmit, isLoading: questLoading, fetchedEntity } = useFamilyQuestForm({familyQuestId})

  /** アクティブレベル（watch().detailsの最初のレベルを初期値とする） */
  const [activeLevel, setActiveLevel] = useState<string | null>(() => {
    const details = watch().details
    if (details && details.length > 0) {
      return details[0].level.toString()
    }
    return "1"
  })

  // エンティティ取得時のハンドル
  useEffect(() => {
    if (fetchedEntity?.base.id) {
      // 全体の家族クエストIDを設定する
      setFamilyQuestId(fetchedEntity.base.id)
    }
  }, [fetchedEntity])

  /** タグ入力状態 */
  const [tagInputValue, setTagInputValue] = useState("")

  /** IME入力状態 */
  const [isComposing, setIsComposing] = useState(false)

  // レベル別の保存状態を管理
  const [levels, setLevels] = useState<Record<string, boolean>>({
    "1": false, 
    "2": false,
    "3": false,
    "4": false,
    "5": false,
  })

  /** レベル保存ハンドル */
  const handleLevelSave = (level: string) => {
    // 現在のレベルを完了としてマークする
    setLevels(prev => ({ ...prev, [level]: true }))
    
    // 可能な場合は次のレベルに切り替える
    const nextLevel = (parseInt(level) + 1).toString()
    if (parseInt(nextLevel) <= 5) {
      setActiveLevel(nextLevel)
    }
  }

  /** タグ入力時のハンドル */
  const handleTag = () => {
    const newTag = tagInputValue.trim()
    // タグが空白もしくは既に登録済みの場合、処理を終了する
    if (newTag && !watch().tags.includes(newTag)) {
      // タグを追加する
      setValue("tags", [...watch().tags, newTag])
    }
    // タグ入力状態を初期化する
    setTagInputValue("")
  }

  /** フォーム送信ハンドル */
  const onSubmit = handleSubmit((form) => {
    if (familyQuestId) {
      handleUpdate({form, familyQuestId, updatedAt: fetchedEntity?.base.updatedAt})
    } else {
      handleRegister({form})
    }
  })

  /** 各タブのエラーチェックフラグ */
  const hasBasicErrors = !!(errors.name || errors.iconId || errors.iconColor || errors.categoryId || errors.tags || errors.client || errors.requestDetail || errors.ageFrom || errors.ageTo || errors.monthFrom || errors.monthTo)
  const hasDetailErrors = !!(errors.details)
  const hasChildErrors = !!(errors.childIds)
  const hasOnlineErrors = !!(errors.isPublic || errors.isClientPublic || errors.isRequestDetailPublic)

  return (
    <>
      <Box pos="relative">
        {/* ロード中のオーバーレイ */}
        <LoadingOverlay visible={questLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        
        {/* 家族クエスト入力フォーム */}
        <form onSubmit={onSubmit}>
          <Paper p="md" withBorder style={{ height: 'calc(100vh - 60px - 2rem)', display: 'flex', flexDirection: 'column' }}>
            <Tabs value={activeTab} onChange={setActiveTab} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <Tabs.List>
                <Tabs.Tab 
                  value="basic" 
                  rightSection={hasBasicErrors ? <IconAlertCircle size={16} color="red" /> : null}
                >
                  基本設定
                </Tabs.Tab>
                <Tabs.Tab 
                  value="details"
                  rightSection={hasDetailErrors ? <IconAlertCircle size={16} color="red" /> : null}
                >
                  詳細設定
                </Tabs.Tab>
                <Tabs.Tab 
                  value="children"
                  rightSection={hasChildErrors ? <IconAlertCircle size={16} color="red" /> : null}
                >
                  子供設定
                </Tabs.Tab>
                <Tabs.Tab 
                  value="online"
                  rightSection={hasOnlineErrors ? <IconAlertCircle size={16} color="red" /> : null}
                >
                  オンライン設定
                </Tabs.Tab>
              </Tabs.List>

              {/* 一般設定 */}
              <Tabs.Panel value="basic" pt="xs" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
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
              </Tabs.Panel>

              {/* 詳細設定 */}
              <Tabs.Panel value="details" pt="xs" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
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
              </Tabs.Panel>

              {/* 子供設定 */}
              <Tabs.Panel value="children" pt="xs" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                <ChildSettings
                  watch={watch}
                  setValue={setValue}
                />
              </Tabs.Panel>

              {/* オンライン設定 */}
              <Tabs.Panel value="online" pt="xs" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                <OnlineSettings
                  register={register}
                  watch={watch}
                  setValue={setValue}
                />
              </Tabs.Panel>

            </Tabs>

            {/* サブミットボタン */}
            <Group mt="md" justify="flex-end">
              {familyQuestId ? 
              <>
                <Button onClick={() => handlePublish({familyQuestId})}>オンラインに公開</Button>
                <Button onClick={() => router.push(`${FAMILY_QUEST_VIEW_URL(familyQuestId)}`)}>表示確認</Button>
                <Button color="red.7" onClick={() => handleDelete({familyQuestId, updatedAt: fetchedEntity?.base.updatedAt})} loading={submitLoading}>削除</Button>
                <Button type="submit" loading={submitLoading} disabled={!isValueChanged}>更新</Button>
              </>
              :
                <Button type="submit" loading={submitLoading}>登録</Button>
              }
            </Group>
          </Paper>
        </form>
      </Box>

      {/* アイコン選択ポップアップ */}
      <IconSelectPopup 
        opened={iconPopupOpened} 
        close={closeIconPopup} 
        setIcon={(iconId) => setValue("iconId", iconId)}
        setColor={(iconColor) => setValue("iconColor", iconColor)}
        currentIconId={watch().iconId} 
        currentColor={watch().iconColor} 
      />
    </>
  )
}

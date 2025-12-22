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

export const FamilyQuestForm = ({id}: {id?: string}) => {
  const [activeTab, setActiveTab] = useState<string | null>("basic")
  const [activeLevel, setActiveLevel] = useState<string | null>("1")

  /** 家族クエストID */
  const [questId, setQuestId] = useState<string | undefined>(id)

  /** アイコン選択ポップアップ制御状態 */
  const [iconPopupOpened, { open: openIconPopup, close: closeIconPopup }] = useDisclosure(false)

  /** ハンドラ */
  const { handleDelete, isLoading: deleteLoading } = useDeleteFamilyQuest()
  const { handleRegister, isLoading: registerLoading } = useRegisterFamilyQuest({setId: setQuestId})
  const { handleUpdate, isLoading: updateLoading } = useUpdateFamilyQuest()

  /** 更新中のローダ状態 */
  const [submitLoading, setSubmitLoading] = useState(false)
  useEffect(() => {
    setSubmitLoading(deleteLoading || registerLoading || updateLoading)
  }, [deleteLoading, registerLoading, updateLoading])

  /** 家族クエストフォームを取得する */
  const { register, errors, setValue, watch, isValueChanged, handleSubmit, isLoading: questLoading, fetchedEntity } = useFamilyQuestForm({questId})

  useEffect(() => {
    if (fetchedEntity?.id) {
      setQuestId(fetchedEntity.id)
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
    if (questId) {
      handleUpdate({form, questId, updatedAt: fetchedEntity?.updated_at})
    } else {
      handleRegister({form})
    }
  })

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
                <Tabs.Tab value="basic">基本設定</Tabs.Tab>
                <Tabs.Tab value="details">詳細設定</Tabs.Tab>
                <Tabs.Tab value="children">子供設定</Tabs.Tab>
                <Tabs.Tab value="online">オンライン設定</Tabs.Tab>
              </Tabs.List>

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

              <Tabs.Panel value="children" pt="xs" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                <ChildSettings
                  watch={watch}
                  setValue={setValue}
                />
              </Tabs.Panel>

              <Tabs.Panel value="online" pt="xs" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                <OnlineSettings
                  register={register}
                  watch={watch}
                />
              </Tabs.Panel>

            </Tabs>

            {/* サブミットボタン */}
            <Group mt="md" justify="flex-end">
              {questId ? 
              <>
                <Button color="red.7" onClick={() => handleDelete({questId, updatedAt: fetchedEntity?.updated_at})} loading={submitLoading}>削除</Button>
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

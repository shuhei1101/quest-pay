'use client'

import { ActionIcon, Box, Text, Button, Checkbox, Group, Input, Loader, LoadingOverlay, Pill, PillsInput, Space, Textarea} from "@mantine/core"
import { FormBackButton } from "@/app/(core)/_components/FormBackButton"
import { QUESTS_URL } from "@/app/(core)/constants"
import { IconSelectPopup } from "@/app/(app)/icons/IconSelectPopup"
import { useDisclosure } from "@mantine/hooks"
import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { useEffect, useState } from "react"
import { useDeleteFamilyQuest } from "../_hooks/useDeleteFamilyQuest"
import { useRegisterFamilyQuest } from "../_hooks/useRegisterFamilyQuest"
import { useUpdateFamilyQuest } from "../_hooks/useUpdateFamilyQuest"
import { useFamilyQuestForm } from "../_hooks/useFamilyQuestForm"
import { devLog } from "@/app/(core)/util"

/** 家族クエストフォーム */
export const FamilyQuestForm = ( params: {
  id?: string
}) => {

  /** 家族クエストID */
  const [id, setId] = useState<number | undefined>(() => params.id ? Number(params.id) : undefined)
  devLog("FamilyQuestForm.ID: ", id)

  /** ポップアップ制御状態 */
  const [popupOpened, { open: openPopup, close: closePopup }] = useDisclosure(false)
  
  /** ハンドラ */
  const { handleDelete, isLoading: deleteLoading } = useDeleteFamilyQuest()
  const { handleRegister, isLoading: registerLoading } = useRegisterFamilyQuest({setId})
  const { handleUpdate, isLoading: updateLoading } = useUpdateFamilyQuest()

  /** 更新中のローダ状態 */
  const [submitLoading, setSubmitLoading] = useState(false)
  useEffect(() => {
    setSubmitLoading(deleteLoading || registerLoading || updateLoading)
  }, [deleteLoading, registerLoading, updateLoading])

  // 家族クエストフォームを取得する
  const { register: questRegister, errors, setValue: setFamilyQuestValue, watch: watchFamilyQuest, isValueChanged, handleSubmit, isLoading: questLoading, fetchedEntity } = useFamilyQuestForm({questId: id})
 
  useEffect(() => {
    if (fetchedEntity?.id) {
      setId(fetchedEntity.id)
      devLog("FamilyQuestForm.useEffect.ID: ", id)
    }
  }, [fetchedEntity])

  /** タグ入力状態 */
  const [tagInputValue, setTagInputValue] = useState("")

  // タグ入力時のハンドル
  const handleTag = () => {
    const newTag = tagInputValue.trim()
    // タグが空白もしくは既に登録済みの場合、処理を終了する
    if (newTag && !watchFamilyQuest().tags.includes(newTag)) {
      // タグを追加する
      setFamilyQuestValue("tags", [...watchFamilyQuest().tags, newTag])
    }
    // タグ入力状態を初期化する
    setTagInputValue("")
  }
  
  /** IME入力状態 */
  const [isComposing, setIsComposing] = useState(false)

  return (
    <>
      <div>

      <Box pos="relative" className="max-w-120">
        {/* ロード中のオーバーレイ */}
        <LoadingOverlay visible={questLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2, }} />
        {/* 家族クエスト入力フォーム */}
        <form onSubmit={handleSubmit((form) => id ?
          handleUpdate({form, questId: id, updatedAt: fetchedEntity?.updated_at})
          :handleRegister({form}))}
        >
          {/* 入力欄のコンテナ */}
          <div className="flex flex-col gap-2">
            {/* 家族クエスト名入力 */}
            <div>
              <Input.Wrapper label="家族クエスト名" required error={errors.name?.message}>
                <Input className="max-w-120" {...questRegister("name")} />
              </Input.Wrapper>
            </div>
            {/* 親アイコン選択 */}
            <div>
              <Input.Wrapper label="家族クエストアイコン" required error={errors.icon?.message}>
                <div>
                  <ActionIcon variant="outline" radius="xl"
                    onClick={ () => openPopup() }>
                    <RenderIcon iconName={watchFamilyQuest().icon} />
                  </ActionIcon>
                </div>
              </Input.Wrapper>
            </div>
            {/* タグ選択 */}
            <div>
              <PillsInput label="タグ"
              description={"条件絞り込みで使用"}
              error={errors.tags?.message}>
                <Pill.Group>
                  {watchFamilyQuest().tags.map((tag) => (
                    <Pill key={tag} withRemoveButton
                      onRemove={() => {
                        setFamilyQuestValue("tags", watchFamilyQuest().tags.filter((t) => t !== tag))
                      }}
                    >{tag}</Pill>
                  ))}
                  <PillsInput.Field placeholder="タグを追加" 
                    value={tagInputValue}
                    onChange={(e) => setTagInputValue(e.target.value)}
                    onBlur={() => handleTag()}
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={() => setIsComposing(false)}
                    onKeyDown={(e) => {
                      if (e.key == "Enter" && !isComposing) {
                        e.preventDefault()
                        handleTag()
                      }
                    }}
                  />
                </Pill.Group>
              </PillsInput>
            </div>
          </div>
          <Space h="md" />
          {/* サブミットボタン */}
          <Group>
            {id ? 
            <>
              <Button hidden={false} loading={questLoading || submitLoading} color="red.7" onClick={() => handleDelete({questId: id, updatedAt: fetchedEntity?.updated_at})} >削除</Button>
              <Button hidden={false} type="submit" loading={questLoading || submitLoading} disabled={!isValueChanged} >更新</Button>
            </>
            :
              <Button hidden={false} type="submit" loading={questLoading || submitLoading} >登録</Button>
            }
          </Group>
        </form>
      </Box>
      </div>
      <IconSelectPopup opened={ popupOpened } close={ closePopup } setIcon={ (icon) => setFamilyQuestValue("icon", icon) } />
    </>
  )
}

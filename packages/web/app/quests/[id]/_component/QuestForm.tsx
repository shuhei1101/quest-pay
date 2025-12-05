'use client';
import { AuthorizedPageLayout } from "@/app/login/_components/AuthorizedPageLayout";
import { ActionIcon, Box, Button, Checkbox, Group, Input, LoadingOverlay, Pill, PillsInput, Space, Textarea} from "@mantine/core";
import { useQuestForm } from "../_hooks/useQuestForm";
import { FormBackButton } from "@/app/(core)/_components/FormBackButton";
import { useQuestDelete } from "../_hooks/useQuestDelete";
import { useQuestSave } from "../_hooks/useQuestSave";
import { useQuestUpdate } from "../_hooks/useQuestUpdate";
import { QUESTS_URL } from "@/app/(core)/constants";
import { useLoginUserInfo } from "@/app/login/_hooks/useLoginUserInfo";
import { IconSelectPopup } from "@/app/(core)/_icon/IconSelectPopup";
import { useDisclosure } from "@mantine/hooks";
import { RenderIcon } from "@/app/(core)/_icon/_components/RenderIcon";
import { useState } from "react";

/** クエストフォーム */
export const QuestForm = ( params: {
  /** クエストID */
  id?: string;
}) => {

  /** ログインユーザ情報を取得する */
  const { userInfo } = useLoginUserInfo()
  
  const [popupOpened, { open: openPopup, close: closePopup }] = useDisclosure(false)

  /** ハンドラ */
  const { handleDelete } = useQuestDelete()
  const { handleSave } = useQuestSave()
  const { handleUpdate } = useQuestUpdate()

  /** 新規登録フラグ */
  const isNew = !params.id || params.id === "";
  /** ID（数値型） */
  const id = params.id ? Number(params.id) : 0;
  
  // クエストフォームを取得する
  const { register: questRegister, errors, setValue: setQuestValue, watch: watchQuest, isValueChanged, handleSubmit, isLoading: questLoading, fetchedQuest, entity } = useQuestForm({id});
  /** 全体のロード状態 */
  const loading = questLoading;
 
  /** タグ入力状態 */
  const [tagInputValue, setTagInputValue] = useState("")

  // タグ入力時のハンドル
  const handleTag = () => {
    const newTag = tagInputValue.trim()
    // タグが空白もしくは既に登録済みの場合、処理を終了する
    if (newTag && !watchQuest().tags.includes(newTag)) {
      // タグを追加する
      setQuestValue("tags", [...watchQuest().tags, newTag])
    }
    // タグ入力状態を初期化する
    setTagInputValue("")
  }

  
  /** IME入力状態 */
  const [isComposing, setIsComposing] = useState(false);

  return (
    <>
      <AuthorizedPageLayout title={isNew ? "クエスト作成": "クエスト編集"} 
      actionButtons={<FormBackButton isValueChanged={isValueChanged} previousScreenURL={QUESTS_URL} />}>
        <div>

        <Box pos="relative" className="max-w-120">
          {/* ロード中のオーバーレイ */}
          <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2, }} />
          {/* クエスト入力フォーム */}
          <form onSubmit={handleSubmit((form) => isNew ? handleSave({form, user_id: userInfo!.user_id}) : handleUpdate({form, quest_id: id, user_id: userInfo!.user_id, updated_at: entity!.updated_at}))}>
            {/* 入力欄のコンテナ */}
            <div className="flex flex-col gap-2">
              {/* クエスト名入力 */}
              <div>
                <Input.Wrapper label="クエスト名" required error={errors.name?.message}>
                  <Input className="max-w-120" {...questRegister("name")} />
                </Input.Wrapper>
              </div>
              {/* 親アイコン選択 */}
              <div>
                <Input.Wrapper label="クエストアイコン" required error={errors.icon?.message}>
                  <div>
                    <ActionIcon variant="outline" radius="xl"
                      onClick={ () => openPopup() }>
                      <RenderIcon iconName={watchQuest().icon} />
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
                    {watchQuest().tags.map((tag) => (
                      <Pill key={tag} withRemoveButton
                        onRemove={() => {
                          setQuestValue("tags", watchQuest().tags.filter((t) => t !== tag))
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
              {isNew ? 
                <Button hidden={false} type="submit" loading={loading} >保存</Button>
              :
              <>
                <Button hidden={false} loading={loading} color="red.7" onClick={() => handleDelete({id: entity!.id, updated_at: entity!.updated_at})} >削除</Button>
                <Button hidden={false} type="submit" loading={loading} disabled={!isValueChanged} >更新</Button>
              </>
              }
            </Group>
          </form>
        </Box>
        </div>
        <IconSelectPopup opened={ popupOpened } close={ closePopup } setIcon={ (icon) => setQuestValue("icon", icon) } />
      </AuthorizedPageLayout>
    </>
  )
}

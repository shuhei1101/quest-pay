'use client';
import { AuthorizedPageLayout } from "@/app/(auth)/_components/AuthorizedPageLayout";
import { ActionIcon, Box, Button, Checkbox, Group, Input, LoadingOverlay, Pill, PillsInput, Space, Textarea} from "@mantine/core";
import { useTaskForm } from "../_hooks/useTaskForm";
import { FormBackButton } from "@/app/(shared)/_components/FormBackButton";
import { useTaskDelete } from "../_hooks/useTaskDelete";
import { useTaskSave } from "../_hooks/useTaskSave";
import { useTaskUpdate } from "../_hooks/useTaskUpdate";
import { TASKS_URL } from "@/app/(core)/appConstants";
import { useLoginUserInfo } from "@/app/(auth)/_hooks/useLoginUserInfo";
import { IconSelectPopup } from "@/app/(shared)/_icon/IconSelectPopup";
import { useDisclosure } from "@mantine/hooks";
import { RenderIcon } from "@/app/(shared)/_icon/_components/RenderIcon";
import { useState } from "react";

/** タスクフォーム */
export const TaskForm = ( params: {
  /** タスクID */
  id?: string;
}) => {

  /** ログインユーザ情報を取得する */
  const { userInfo } = useLoginUserInfo()
  
  const [popupOpened, { open: openPopup, close: closePopup }] = useDisclosure(false)

  /** ハンドラ */
  const { handleDelete } = useTaskDelete()
  const { handleSave } = useTaskSave()
  const { handleUpdate } = useTaskUpdate()

  /** 新規登録フラグ */
  const isNew = !params.id || params.id === "";
  /** ID（数値型） */
  const id = params.id ? Number(params.id) : 0;
  
  // タスクフォームを取得する
  const { register: taskRegister, errors, setValue: setTaskValue, watch: watchTask, isValueChanged, handleSubmit, isLoading: taskLoading, fetchedTask, entity } = useTaskForm({id});
  /** 全体のロード状態 */
  const loading = taskLoading;
 
  /** タグ入力状態 */
  const [tagInputValue, setTagInputValue] = useState("")

  // タグ入力時のハンドル
  const handleTag = () => {
    const newTag = tagInputValue.trim()
    // タグが空白もしくは既に登録済みの場合、処理を終了する
    if (newTag && !watchTask().tags.includes(newTag)) {
      // タグを追加する
      setTaskValue("tags", [...watchTask().tags, newTag])
    }
    // タグ入力状態を初期化する
    setTagInputValue("")
  }

  /** IME入力状態 */
  const [isComposing, setIsComposing] = useState(false);

  return (
    <>
      <AuthorizedPageLayout title={isNew ? "タスク作成": "タスク編集"} 
      actionButtons={<FormBackButton isValueChanged={isValueChanged} previousScreenURL={TASKS_URL} />}>
        <div>

        <Box pos="relative" className="max-w-120">
          {/* ロード中のオーバーレイ */}
          <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2, }} />
          {/* タスク入力フォーム */}
          <form onSubmit={handleSubmit((form) => isNew ? handleSave({form, user_id: userInfo!.user_id}) : handleUpdate({form, task_id: id, user_id: userInfo!.user_id, updated_at: entity!.updated_at}))}>
            {/* 入力欄のコンテナ */}
            <div className="flex flex-col gap-2">
              {/* タスク名入力 */}
              <div>
                <Input.Wrapper label="タスク名" required error={errors.name?.message}>
                  <Input className="max-w-120" {...taskRegister("name")} />
                </Input.Wrapper>
              </div>
              {/* 親アイコン選択 */}
              <div>
                <Input.Wrapper label="タスクアイコン" required error={errors.icon?.message}>
                  <div>
                    <ActionIcon variant="outline" radius="xl"
                      onClick={ () => openPopup() }>
                      <RenderIcon iconName={watchTask().icon} />
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
                    {watchTask().tags.map((tag) => (
                      <Pill key={tag} withRemoveButton
                        onRemove={() => {
                          setTaskValue("tags", watchTask().tags.filter((t) => t !== tag))
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
        <IconSelectPopup opened={ popupOpened } close={ closePopup } setIcon={ (icon) => setTaskValue("icon", icon) } />
      </AuthorizedPageLayout>
    </>
  )
}

'use client';
import { AuthorizedPageLayout } from "@/app/(auth)/_components/AuthorizedPageLayout";
import { Box, Button, Checkbox, Group, Input, LoadingOverlay, Space, Textarea} from "@mantine/core";
import { useTaskForm } from "../_hooks/useTaskForm";
import { FormBackButton } from "@/app/(shared)/_components/FormBackButton";
import { TaskStatusCombobox } from "./TaskStatusCombobox";
import { useTaskStatuses } from "../../../_hooks/useTaskStatuses";
import { useTaskDelete } from "../_hooks/useTaskDelete";
import { useTaskSave } from "../_hooks/useTaskSave";
import { useTaskUpdate } from "../_hooks/useTaskUpdate";
import { TASKS_URL } from "@/app/(core)/appConstants";
import { useLoginUserInfo } from "@/app/(auth)/_hooks/useLoginUserInfo";

/** タスクフォーム */
export const TaskForm = ( params: {
  /** タスクID */
  id?: string;
}) => {

  /** ログインユーザ情報を取得する */
  const {isGuest, isAdmin} = useLoginUserInfo()

  /** ハンドラ */
  const { handleDelete } = useTaskDelete()
  const { handleSave } = useTaskSave()
  const { handleUpdate } = useTaskUpdate()

  /** 新規登録フラグ */
  const isNew = !params.id || params.id === "";
  /** ID（数値型） */
  const id = params.id ? Number(params.id) : 0;
  
  // タスクフォームを取得する
  const { register: taskRegister, errors, setValue: setTaskValue, watch: watchTask, isValueChanged, handleSubmit, isLoading: taskLoading, fetchedTask } = useTaskForm({id});
  // タスクステータスを取得する
  const { fetchedStatuses, isLoading: statusLoading } = useTaskStatuses()
  /** 全体のロード状態 */
  const loading = statusLoading || taskLoading;

  /** ステータス変更時のハンドル */
  const handleChangedStatus = (val?: number) => {
    // ステータスをセットする
    setTaskValue("status_id", val)
  }
 
  return (
    <>
      <AuthorizedPageLayout title={isNew ? "タスク作成": "タスク編集"} 
      actionButtons={<FormBackButton isValueChanged={isValueChanged} previousScreenURL={TASKS_URL} />}>
        <div>

        <Box pos="relative" className="max-w-120">
          {/* ロード中のオーバーレイ */}
          <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2, }} />
          {/* ゲストの場合は参照のみにする */}
          <fieldset disabled={isGuest} style={{ border: 0, padding: 0 }}>
            {/* タスク入力フォーム */}
            <form onSubmit={handleSubmit((form) => isNew ? handleSave(form) : handleUpdate(form))}>
              {/* 入力欄のコンテナ */}
              <div className="flex flex-col gap-2">
                {/* ID入力欄 */}
                <div>
                  <Input.Wrapper label="ID" error={errors.id?.message}>
                    <div className="h-6">
                      {/* idがない場合、「-」を表示する */}
                      <p>{ id != 0 ? id : "-" }</p>
                      <input type="hidden" value={id} {...taskRegister("id", { valueAsNumber: true })} />
                    </div>
                  </Input.Wrapper>
                </div>
                {/* タスク名入力欄 */}
                <div>
                  <Input.Wrapper label="タスク名" required error={errors.name?.message}>
                    <Input className="max-w-120" {...taskRegister("name")} />
                  </Input.Wrapper>
                </div>
                {/* タスク詳細入力欄 */}
                <div>
                    <Input.Wrapper label="タスク詳細" error={errors.detail?.message}>
                      <Textarea className="max-w-120" placeholder="200文字以内で入力してください。"
                      autosize minRows={4} maxRows={4} {...taskRegister("detail")} />
                    </Input.Wrapper>
                </div>
                {/* ステータス入力欄 */}
                <div>
                  <Input.Wrapper label="ステータス" required error={errors.status_id?.message}>
                    <TaskStatusCombobox taskStatuses={fetchedStatuses} currentValue={watchTask("status_id")} onChanged={handleChangedStatus} />
                  </Input.Wrapper>
                </div>
                {/* メール送信入力欄 */}
                <div>
                  <Input.Wrapper label="メール送信">
                    <Checkbox
                      {...taskRegister("send_mail")}
                    />
                  </Input.Wrapper>
                </div>
              </div>
              <Space h="md" />
              {/* サブミットボタン */}
              <Group>
                {isNew ? 
                  <Button hidden={isGuest} type="submit" loading={loading} >保存</Button>
                :
                <>
                  <Button hidden={isGuest} loading={loading} color="red.7" onClick={() => handleDelete(fetchedTask)} >削除</Button>
                  <Button hidden={isGuest} type="submit" loading={loading} disabled={!isValueChanged} >更新</Button>
                </>
                }
              </Group>
            </form>
          </fieldset>
        </Box>
        </div>
      </AuthorizedPageLayout>
    </>
  )
}

'use client';
import { AuthorizedPageLayout } from "@/app/(auth)/_components/AuthorizedPageLayout";
import { Box, Button, Checkbox, Group, Input, LoadingOverlay, Space, Textarea} from "@mantine/core";
import { useFamilyForm } from "../_hooks/useFamilyForm";
import { FormBackButton } from "@/app/(shared)/_components/FormBackButton";
import { useFamilySave } from "../_hooks/useFamilySave";
import { TASKS_URL } from "@/app/(core)/appConstants";
import { useLoginUserInfo } from "@/app/(auth)/_hooks/useLoginUserInfo";

/** 家族フォーム */
export const FamilyForm = ( params: {
  /** 家族ID */
  id?: string;
}) => {

  /** ログインユーザ情報を取得する */
  const {isGuest, isAdmin} = useLoginUserInfo()

  /** ハンドラ */
  const { handleDelete } = useFamilyDelete()
  const { handleSave } = useFamilySave()
  const { handleUpdate } = useFamilyUpdate()

  /** 新規登録フラグ */
  const isNew = !params.id || params.id === "";
  /** ID（数値型） */
  const id = params.id ? Number(params.id) : 0;
  
  // 家族フォームを取得する
  const { register: taskRegister, errors, setValue: setFamilyValue, watch: watchFamily, isValueChanged, handleSubmit, isLoading: taskLoading, fetchedFamily } = useFamilyForm({id});
  // 家族ステータスを取得する
  const { fetchedStatuses, isLoading: statusLoading } = useFamilyStatuses()
  /** 全体のロード状態 */
  const loading = statusLoading || taskLoading;

  /** ステータス変更時のハンドル */
  const handleChangedStatus = (val?: number) => {
    // ステータスをセットする
    setFamilyValue("status_id", val)
  }
 
  return (
    <>
      <AuthorizedPageLayout title={isNew ? "家族作成": "家族編集"} 
      actionButtons={<FormBackButton isValueChanged={isValueChanged} previousScreenURL={TASKS_URL} />}>
        <div>

        <Box pos="relative" className="max-w-120">
          {/* ロード中のオーバーレイ */}
          <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2, }} />
          {/* ゲストの場合は参照のみにする */}
          <fieldset disabled={isGuest} style={{ border: 0, padding: 0 }}>
            {/* 家族入力フォーム */}
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
                {/* 家族名入力欄 */}
                <div>
                  <Input.Wrapper label="家族名" required error={errors.name?.message}>
                    <Input className="max-w-120" {...taskRegister("name")} />
                  </Input.Wrapper>
                </div>
                {/* 家族詳細入力欄 */}
                <div>
                    <Input.Wrapper label="家族詳細" error={errors.detail?.message}>
                      <Textarea className="max-w-120" placeholder="200文字以内で入力してください。"
                      autosize minRows={4} maxRows={4} {...taskRegister("detail")} />
                    </Input.Wrapper>
                </div>
                {/* ステータス入力欄 */}
                <div>
                  <Input.Wrapper label="ステータス" required error={errors.status_id?.message}>
                    <FamilyStatusCombobox taskStatuses={fetchedStatuses} currentValue={watchFamily("status_id")} onChanged={handleChangedStatus} />
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
                  <Button hidden={isGuest} loading={loading} color="red.7" onClick={() => handleDelete(fetchedFamily)} >削除</Button>
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

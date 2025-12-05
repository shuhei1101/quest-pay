'use client';
import { AuthorizedPageLayout } from "@/app/login/_components/AuthorizedPageLayout";
import { Box, Button, Group, Input, LoadingOverlay, Space } from "@mantine/core";
import { FormBackButton } from "@/app/(core)/_components/FormBackButton";
import { USERS_URL } from "@/app/(core)/constants";
import { useUserDelete } from "../_hooks/useUserDelete";
import { useUserUpdate } from "../_hooks/useUserUpdate";
import { useUserForm } from "../_hooks/useUserForm";
import { UserTypeCombobox } from "./UserTypeCombobox";
import { appStorage } from "@/app/(core)/_sessionStorage/appStorage"
import { useRouter } from "next/navigation"
import { useUserTypes } from "@/app/(user)/_hooks/useUserTypes";

/** ユーザフォーム */
export const UserForm = ( params: {
  /** ユーザID */
  id?: string;
}) => {
  const router = useRouter()

  /** ハンドラ */
  const { handleDelete } = useUserDelete()
  const { handleUpdate } = useUserUpdate()

  // ユーザフォームを取得する
  const { register: userRegister, errors, setValue: setUserValue, watch: watchUser, isValueChanged, handleSubmit, isLoading: userLoading, fetchedUser } = useUserForm({id: params.id});

  // ロード完了時かつユーザが取得できなかった場合
  if (!userLoading && fetchedUser == null) {
      // 次画面で表示するメッセージを登録する
      appStorage.feedbackMessage.set('該当のユーザが存在しませんでした。')
        
      // ユーザ一覧画面に戻る
      router.push(`${USERS_URL}`)
    }
    
  // ユーザタイプを取得する
  const { fetchedTypes, isLoading: typeLoading } = useUserTypes()
  /** 全体のロード状態 */
  const loading = typeLoading || userLoading;


  /** タイプ変更時のハンドル */
  const handleChangedStatus = (val?: number) => {
    // タイプをセットする
    setUserValue("type_id", val)
  }

  return (
    <>
      <AuthorizedPageLayout title={"ユーザ編集"} requiredParent={true}
      actionButtons={<FormBackButton isValueChanged={isValueChanged} previousScreenURL={USERS_URL} />}>
        <div>

        <Box pos="relative" className="max-w-120">
          {/* ロード中のオーバーレイ */}
          <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2, }} />
          {/* ゲストの場合は参照のみにする */}
          <fieldset style={{ border: 0, padding: 0 }}>
            {/* ユーザ入力フォーム */}
            <form onSubmit={handleSubmit((form) => handleUpdate(form))}>
              {/* 入力欄のコンテナ */}
              <div className="flex flex-col gap-2">
                {/* ID入力欄 */}
                <div>
                  <Input.Wrapper label="ID">
                    <div className="h-6">
                      <p>{params.id}</p>
                      <input type="hidden" value={params.id} />
                    </div>
                  </Input.Wrapper>
                </div>
                {/* ユーザ名入力欄 */}
                <div>
                  <Input.Wrapper label="氏名" required error={errors.name?.message}>
                    <Input className="max-w-120" {...userRegister("name")} />
                  </Input.Wrapper>
                </div>
                {/* タイプ入力欄 */}
                <div>
                  <Input.Wrapper label="タイプ" required error={errors.type?.message}>
                    <UserTypeCombobox userTypes={fetchedTypes} currentValue={watchUser("type_id")} onChanged={handleChangedStatus} />
                  </Input.Wrapper>
                </div>
              </div>
              <Space h="md" />
              {/* サブミットボタン */}
              <Group>
                <>
                  <Button loading={loading} color="red.7" onClick={() => handleDelete(fetchedUser)} >削除</Button>
                  <Button type="submit" loading={loading} disabled={!isValueChanged} >更新</Button>
                </>
              </Group>
            </form>
          </fieldset>
        </Box>
        </div>
      </AuthorizedPageLayout>
    </>
  )
}

import { Button, Group, Input, Modal, Space, Title } from "@mantine/core"
import { useUserForm } from "../_hooks/useRegisterUserForm";
import { useUserSave } from "../../(app)/users/_hooks/useUserSave";
import { useEffect } from "react";

/** 名前入力ポップアップ */
export const NameRegisterPopup = ({opened ,close, userId}: {
  opened: boolean,
  close: () => void,
  userId: string
}) => {

  /** ハンドル */
  const { handleSave } = useUserSave({close})

  // ユーザフォームを取得する
  const { register: userRegister, errors, setValue: setUserValue, watch: watchUser, handleSubmit } = useUserForm();

  // 引数のuserIdをセットする
  useEffect(() => {
    setUserValue("user_id", userId)
  }, [userId])

  return (
    <Modal opened={opened} onClose={close} title="ユーザ情報を入力してください。"
    withCloseButton={false}  // 閉じるボタン非表示
    closeOnClickOutside={false}  // モーダル外クリックの無効化
    closeOnEscape={false}  // ESC キーで閉じない
    >
      <form onSubmit={handleSubmit((form) => handleSave(form))} >
        {/* 入力欄のコンテナ */}
        <div className="flex flex-col gap-2">
          {/* クエスト名入力欄 */}
          <div>
            <Input.Wrapper label="クエスト名" required error={errors.name?.message}>
              <Input className="max-w-120" {...userRegister("name")} placeholder="例: 田中　太郎" />
            </Input.Wrapper>
          </div>
        </div>
        <Space h="md" />
        <div className="flex w-full justify-end">
          <Button type="submit" >登録</Button>
        </div>
      </form>
    </Modal>
  )
}

import { Button, Input, Modal, Space, Text } from "@mantine/core"
import { useUserForm } from "../_hooks/useRegisterUserForm"
import { useEffect } from "react"
import { useLoginUserInfo } from "../_hooks/useLoginUserInfo"
import useSWR from "swr"
import { fetchChild } from "@/app/(child)/_query/childQuery"
import { useChild } from "@/app/(child)/_hooks/useChild"
import { useParent } from "@/app/(parent)/_hooks/useParent"
import { useFamily } from "@/app/(family)/_hooks/useFamily"
// import { useTypeSelect } from "../_hooks/useRoleSelect"

/** ロール選択ポップアップ */
export const SelectRolePopup = ({opened ,close}: {
  opened: boolean,
  close: () => void,
}) => {

  /** ハンドル */
  // const { handleSave } = useTypeSelect({close})

  /** ログインユーザ情報 */
  const { userId, userInfo, isLoading: userLoading } = useLoginUserInfo()

  /** ユーザIDに紐づく子供情報 */
  const { data: child, mutate: mutateChild } = useChild(userId)
  /** ユーザIDに紐づく親情報 */
  const { data: parent, mutate: mutateParent } = useParent(userId)
  /** 家族ID */
  const familyId = child?.family_id || parent?.family_id;
  /** 家族情報 */
  const { data: family, mutate: mutateFamily } = useFamily(familyId)

  useEffect(() => {
    if (!opened) return

    if (userId) {
      mutateChild()
      mutateParent()
      if (familyId) mutateFamily()
    }
  }, [opened])

  return (
    <Modal opened={opened} onClose={close} title="ログインタイプ選択"
    withCloseButton={true}  // 閉じるボタン非表示
    closeOnClickOutside={true}  // モーダル外クリックの無効化
    closeOnEscape={true}  // ESCキーで閉じない
    >
      {family ? <>
      {/* 家族が取得できた場合 */}
        <div className="flex flex-col gap-2">
          {/* 家族名表示欄 */}
          <Text>{family.local_name}</Text>
          {/* 親ユーザログインボタン */}
          <Button variant="light">親でログイン</Button>
          {/* 子ユーザログインボタン */}
          <Button variant="light">子でログイン</Button>
        </div>
      </> : <>
      {/* 家族が取得できなかった場合 */}
        <div className="flex flex-col gap-2">
          {/* 新規家族作成ボタン */}
          <Button variant="light">家族を作成する</Button>
          {/* 家族に参加ボタン */}
          <Button variant="light">家族に参加する</Button>
        </div>
      </>}
    </Modal>
  )
}

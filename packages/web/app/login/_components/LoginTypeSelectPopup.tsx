import { Button, Input, Modal, Space, Text } from "@mantine/core"
import { useRouter } from "next/navigation"
import { FAMILY_NEW_URL, FAMILY_QUESTS_URL } from "@/app/(core)/constants"
import { useEffect, useState } from "react"
import { useLoginUserInfo } from "../_hooks/useLoginUserInfo"
import { devLog } from "@/app/(core)/util"
import { useJoinAsParent } from "../_hooks/useJoinAsParent"
import { useJoinAsChild } from "../_hooks/useJoinAsChild"


/** ログインタイプ選択ポップアップ */
export const LoginTypeSelectPopup = ({opened ,close}: {
  opened: boolean,
  close: () => void,
}) => {
  const router = useRouter()

  /** ユーザIDに紐づく家族情報 */
  const { userInfo, refetch } = useLoginUserInfo()
  
  /** 親招待コード */
  const [parentInviteCode, setParentInviteCode] = useState("")
  /** 親招待コードのバリデーションエラー */
  const [parentInviteCodeError, setParentInviteCodeError] = useState("")
  
  /** 子招待コード */
  const [childInviteCode, setChildInviteCode] = useState("")
  /** 子招待コードのバリデーションエラー */
  const [childInviteCodeError, setChildInviteCodeError] = useState("")

  /** 親として家族に参加するハンドル */
  const { handleJoinAsParent, isLoading: isJoiningAsParent } = useJoinAsParent({refetch, setParentInviteCodeError})
  /** 子として家族に参加するハンドル */
  const { handleJoinAsChild, isLoading: isJoiningAsChild } = useJoinAsChild({refetch, setChildInviteCodeError})

  // ポップアップ起動時の処理
  useEffect(() => {
    if (!opened) return
    // ユーザ情報を再取得する
    refetch()
    devLog("ユーザ情報: ", JSON.stringify(userInfo))
    // 状態をリセットする
    setParentInviteCode("")
    setParentInviteCodeError("")
    setChildInviteCode("")
    setChildInviteCodeError("")
  }, [opened])

  return (
    <Modal opened={opened} onClose={close} title="ログインタイプ選択"
    withCloseButton={true}  // 閉じるボタン非表示
    closeOnClickOutside={true}  // モーダル外クリックの無効化
    closeOnEscape={true}  // ESCキーで閉じない
    >
      {userInfo?.family_id ? <>
      {/* 家族が取得できた場合 */}
        <div className="flex flex-col gap-2">
          {/* 家族名表示欄 */}
          <Text>{userInfo.family_local_name}</Text>
          {/* 親ユーザログインボタン */}
          <Button
            onClick={() => router.push(`${FAMILY_QUESTS_URL}`)}
            variant="light"
          >
            親でログイン
          </Button>
          {/* 子ユーザログインボタン */}
          <Button variant="light">子でログイン</Button>
        </div>
      </> : <>
      {/* 家族が取得できなかった場合 */}
        <div className="flex flex-col gap-2">
          {/* 新規家族作成ボタン */}
          <Button variant="light"
            onClick={() => router.push(`${FAMILY_NEW_URL}`)}
          >家族を作成する</Button>
          
          {/* 親として家族に参加するセクション */}
          <div className="flex flex-col gap-1">
            {/* 親招待コード入力フィールド */}
            <Input.Wrapper error={parentInviteCodeError}>
              <Input
                placeholder="親招待コード"
                value={parentInviteCode}
                onChange={(e) => {
                  setParentInviteCode(e.currentTarget.value)
                  setParentInviteCodeError("")
                }}
              />
            </Input.Wrapper>
            {/* 親として家族に参加ボタン */}
            <Button variant="light" onClick={() => handleJoinAsParent({inviteCode: parentInviteCode})}>
              親として家族に参加する
            </Button>
          </div>

          {/* 子として家族に参加するセクション */}
          <div className="flex flex-col gap-1">
            {/* 子招待コード入力フィールド */}
            <Input.Wrapper error={childInviteCodeError}>
              <Input
                placeholder="子招待コード"
                value={childInviteCode}
                onChange={(e) => {
                  setChildInviteCode(e.currentTarget.value)
                  setChildInviteCodeError("")
                }}
              />
            </Input.Wrapper>
            {/* 子として家族に参加ボタン */}
            <Button variant="light" onClick={() => handleJoinAsChild({inviteCode: childInviteCode})}>
              子として家族に参加する
            </Button>
          </div>
        </div>
      </>}
    </Modal>
  )
}

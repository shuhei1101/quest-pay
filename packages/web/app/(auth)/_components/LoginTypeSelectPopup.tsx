import { Button, Input, Modal, Space, Text } from "@mantine/core"
import { useLoginUserInfo } from "../_hooks/useLoginUserInfo"
import { useRouter } from "next/navigation"
import { FAMILY_NEW_URL } from "@/app/(core)/appConstants"
import { useUserFamily } from "@/app/(family)/_hooks/useUserFamily"
import { useEffect } from "react"


/** ログインタイプ選択ポップアップ */
export const LoginTypeSelectPopup = ({opened ,close}: {
  opened: boolean,
  close: () => void,
}) => {
  const router = useRouter()

  /** ハンドル */
  // const { handleCreateFamily } = useFamilyCreate({close})

  /** ユーザIDに紐づく家族情報 */
  const { parent, family, child, isLoading, mutate } = useUserFamily()

  useEffect(() => {
    if (!opened) return
    mutate()
    console.log("家族情報:", family)
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
          <Button variant="light"
            onClick={() => router.push(`${FAMILY_NEW_URL}`)}
          >家族を作成する</Button>
          {/* 家族に参加ボタン */}
          <Button variant="light">家族に参加する</Button>
        </div>
      </>}
    </Modal>
  )
}

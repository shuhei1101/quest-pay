"use client"

import { Button, Modal, Text, TextInput } from "@mantine/core"
import { CopyButton } from "./CopyButton"

/** 招待コードポップアップ */
export const InviteCodePopup = ({opened, close, inviteCode, message}: {
  opened: boolean
  close: () => void
  inviteCode: string
  message: string
}) => {
  return (
    <Modal opened={opened} onClose={close} title="通知">
      {/* 説明文 */}
      <Text size="sm" c="dimmed" mb="md">
        {message}
      </Text>
      
      {/* 招待コード表示 */}
      <div className="mb-4">
        <Text size="sm" fw={500} mb={4}>招待コード</Text>
        <div className="flex items-center gap-2">
          <TextInput
            value={inviteCode}
            readOnly
            className="flex-1"
          />
          {/* コピーボタン */}
          <CopyButton value={inviteCode} />
        </div>
      </div>
      
      {/* 閉じるボタン */}
      <div className="flex justify-end">
        <Button onClick={close}>閉じる</Button>
      </div>
    </Modal>
  )
}

"use client"

import { Button, Group, Modal, Textarea } from "@mantine/core"
import { useState } from "react"
import { useTheme } from "@/app/(core)/_theme/useTheme"

/** キャンセルモーダル */
export const CancelReviewModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: ({requestMessage}: {requestMessage?: string}) => void
  isLoading?: boolean
}) => {
  const [message, setMessage] = useState("")
  const { colors } = useTheme()

  /** 送信ハンドル */
  const handleSubmit = () => {
    onSubmit({requestMessage: message})
    setMessage("")
  }

  /** モーダルを閉じる */
  const handleClose = () => {
    setMessage("")
    onClose()
  }

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      title="申請をキャンセルしますか？"
      centered
      size="md"
    >
      {/* メッセージ入力欄 */}
      <Textarea
        label="メッセージ"
        placeholder="キャンセル理由や連絡事項を入力してください（任意）"
        value={message}
        onChange={(e) => setMessage(e.currentTarget.value)}
        minRows={4}
        maxRows={8}
        mb="md"
      />

      {/* ボタングループ */}
      <Group justify="flex-end" gap="sm">
        {/* いいえボタン */}
        <Button
          variant="outline"
          color={colors.buttonColors.default}
          onClick={handleClose}
          disabled={isLoading}
        >
          いいえ
        </Button>
        
        {/* はいボタン */}
        <Button
          color={colors.buttonColors.danger}
          onClick={handleSubmit}
          loading={isLoading}
        >
          はい
        </Button>
      </Group>
    </Modal>
  )
}

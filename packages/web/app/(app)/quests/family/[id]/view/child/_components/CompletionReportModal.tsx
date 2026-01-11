"use client"

import { Button, Group, Modal, Textarea } from "@mantine/core"
import { useState } from "react"

/** 完了報告モーダル */
export const CompletionReportModal = ({
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
      title="完了報告"
      centered
      size="md"
    >
      {/* メッセージ入力欄 */}
      <Textarea
        label="申請メッセージ"
        placeholder="クエストの完了内容や親への連絡事項を入力してください（任意）"
        value={message}
        onChange={(e) => setMessage(e.currentTarget.value)}
        minRows={4}
        maxRows={8}
        mb="md"
      />

      {/* ボタングループ */}
      <Group justify="flex-end" gap="sm">
        {/* キャンセルボタン */}
        <Button
          variant="outline"
          color="gray"
          onClick={handleClose}
          disabled={isLoading}
        >
          キャンセル
        </Button>
        
        {/* 報告するボタン */}
        <Button
          color="blue"
          onClick={handleSubmit}
          loading={isLoading}
        >
          報告する
        </Button>
      </Group>
    </Modal>
  )
}

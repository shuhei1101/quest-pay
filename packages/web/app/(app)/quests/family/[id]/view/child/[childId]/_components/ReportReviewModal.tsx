"use client"

import { useWindow } from "@/app/(core)/useConstants"
import { Button, Group, LoadingOverlay, Modal, Paper, Stack, Text, Textarea } from "@mantine/core"
import { IconCheck, IconX } from "@tabler/icons-react"
import { useState } from "react"

/** 報告内容確認モーダル */
export const ReportReviewModal = ({
  isOpen,
  onClose,
  onReject,
  onApprove,
  isLoading,
  requestMessage,
}: {
  isOpen: boolean
  onClose: () => void
  onReject: (responseMessage?: string) => void
  onApprove: (responseMessage?: string) => void
  isLoading: boolean
  requestMessage?: string
}) => {
  const [responseMessage, setResponseMessage] = useState("")

  const {isDark} = useWindow()

  /** モーダルを閉じるときの処理 */
  const handleClose = () => {
    setResponseMessage("")
    onClose()
  }

  /** 却下ボタン押下時 */
  const handleReject = () => {
    onReject(responseMessage || undefined)
  }

  /** 受領ボタン押下時 */
  const handleApprove = () => {
    onApprove(responseMessage || undefined)
  }

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      title="報告内容確認"
      size="md"
      centered
    >
      <Paper pos="relative">
        {/* ロード中のオーバーレイ */}
        <LoadingOverlay 
          visible={isLoading} 
          zIndex={1000} 
          overlayProps={{ radius: "sm", blur: 2 }} 
        />

        <Stack gap="md">
          {/* 申請メッセージ表示 */}
          {requestMessage && (
            <Textarea
              label="申請メッセージ"
              value={requestMessage}
              readOnly
              minRows={3}
              maxRows={6}
            />
          )}

          {/* 返信メッセージ入力欄 */}
          <Textarea
            label="返信メッセージ（任意）"
            placeholder="子供へのメッセージを入力してください"
            value={responseMessage}
            onChange={(e) => setResponseMessage(e.currentTarget.value)}
            minRows={3}
            maxRows={6}
          />

          {/* ボタンエリア */}
          <Group justify="space-between" mt="md">
            {/* 却下ボタン */}
            <Button
              color="red"
              leftSection={<IconX size={18} />}
              onClick={handleReject}
              disabled={isLoading}
            >
              却下
            </Button>

            {/* 受領ボタン */}
            <Button
              color="green"
              leftSection={<IconCheck size={18} />}
              onClick={handleApprove}
              disabled={isLoading}
            >
              受領
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Modal>
  )
}

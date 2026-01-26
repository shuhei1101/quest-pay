"use client"

import { Modal } from "@mantine/core"
import { ReactNode } from "react"

/** クエスト編集モーダルProps */
type QuestEditModalProps = {
  /** モーダルが開いているか */
  opened: boolean
  /** モーダルを閉じる関数 */
  onClose: () => void
  /** モーダルの内容 */
  children: ReactNode
}

/** クエスト編集モーダルコンポーネント */
export const QuestEditModal = ({
  opened,
  onClose,
  children,
}: QuestEditModalProps) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="100%"
      padding={0}
      withCloseButton={true}
      closeOnClickOutside={false}
      closeOnEscape={true}
      styles={{
        body: {
          height: '100vh',
          padding: 0,
        },
        content: {
          height: '100vh',
        },
      }}
    >
      {children}
    </Modal>
  )
}

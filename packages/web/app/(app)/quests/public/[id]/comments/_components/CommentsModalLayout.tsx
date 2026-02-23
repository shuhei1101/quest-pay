"use client"

import { Modal, Box, Group, Text, Select } from "@mantine/core"
import { ReactNode } from "react"

type SortType = "newest" | "likes"

type CommentsModalLayoutProps = {
  /** ダークモードかどうか */
  isDark: boolean
  /** モーダルの開閉状態 */
  opened: boolean
  /** モーダルを閉じる関数 */
  onClose: () => void
  /** ソート方法 */
  sortType: SortType
  /** ソート変更時のハンドル */
  onSortChange: (value: SortType) => void
  /** 子要素 */
  children: ReactNode
}

/** コメントモーダルレイアウト */
export const CommentsModalLayout = ({
  isDark,
  opened,
  onClose,
  sortType,
  onSortChange,
  children,
}: CommentsModalLayoutProps) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="lg"
      padding={0}
      title={
        <Group justify="space-between" w="100%" pr="xs">
          <Text fw={600} size="lg">
            コメント
          </Text>
          <Select
            size="xs"
            value={sortType}
            onChange={(value) => onSortChange(value as SortType)}
            data={[
              { value: "newest", label: "新着順" },
              { value: "likes", label: "いいね順" },
            ]}
            w={120}
          />
        </Group>
      }
      styles={{
        content: {
          height: "85vh",
          overflow: "hidden",
        },
        inner: {
          overflow: "hidden",
        },
        body: {
          height: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          padding: 0,
        },
      }}
    >
      <Box
        style={{
          height: "100%",
          overflow: "hidden",
          backgroundColor: isDark ? "#2C2E33" : "#FFFFFF",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </Box>
    </Modal>
  )
}

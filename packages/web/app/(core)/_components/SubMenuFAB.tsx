"use client"
import { IconMenu } from "@tabler/icons-react"
import { FloatingActionButton, FloatingActionItem } from "./FloatingActionButton"
import { useWindow } from "../useConstants"

/** サブメニューFABを表示する */
export const SubMenuFAB = ({
  items,
  open,
  onToggle,
  defaultOpen = false,
  showBackButton = true,
  pattern,
}: {
  /** 展開するアクションアイテムの配列 */
  items: FloatingActionItem[]
  /** 開閉状態（外部制御する場合のみ指定） */
  open?: boolean
  /** 開閉状態を変更する関数（外部制御する場合のみ指定） */
  onToggle?: (open: boolean) => void
  /** デフォルトで展開状態にするか */
  defaultOpen?: boolean
  /** 戻るボタンを表示するか（デフォルトtrue） */
  showBackButton?: boolean
  /** 展開パターン（デフォルトは"radial-up"） */
  pattern?: "slide" | "radial-up" | "radial-left"
}) => {
  const { isMobile } = useWindow()

  return (
    <div
      style={{
        position: "fixed",
        bottom: isMobile ? "16px" : "40px",
        right: isMobile ? "16px" : "40px",
        zIndex: 3000,
      }}
    >
      <FloatingActionButton
        items={items}
        pattern={pattern ?? "radial-up"}
        open={open}
        onToggle={onToggle}
        defaultOpen={defaultOpen}
        mainIcon={<IconMenu size={24} />}
        showBackButton={showBackButton}
      />
    </div>
  )
}

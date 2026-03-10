"use client"
import { IconApps } from "@tabler/icons-react"
import { FloatingActionButton, FloatingActionItem } from "./FloatingActionButton"
import { useWindow } from "../useConstants"

/** ナビゲーションFABを表示する */
export const NavigationFAB = ({
  items,
  activeIndex,
  open,
  onToggle,
  defaultOpen = false,
}: {
  /** 展開するアクションアイテムの配列 */
  items: FloatingActionItem[]
  /** 現在選択されているアイテムのインデックス */
  activeIndex?: number
  /** 開閉状態（外部制御する場合のみ指定） */
  open?: boolean
  /** 開閉状態を変更する関数（外部制御する場合のみ指定） */
  onToggle?: (open: boolean) => void
  /** デフォルトで展開状態にするか */
  defaultOpen?: boolean
}) => {
  const { isMobile } = useWindow()

  return (
    <div
      style={{
        position: "fixed",
        bottom: isMobile ? "16px" : "40px",
        left: isMobile ? "16px" : "40px",
        zIndex: 3000,
      }}
    >
      <FloatingActionButton
        items={items}
        pattern="slide"
        slideDirection="right"
        activeIndex={activeIndex}
        open={open}
        onToggle={onToggle}
        defaultOpen={defaultOpen}
        mainIcon={<IconApps size={24} />}
      />
    </div>
  )
}

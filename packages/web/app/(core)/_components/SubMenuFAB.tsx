"use client"
import { IconMenu, IconArrowLeft } from "@tabler/icons-react"
import { FloatingActionButton, FloatingActionItem } from "./FloatingActionButton"
import { useWindow } from "../useConstants"
import { useRouter } from "next/navigation"
import { useMemo, useCallback } from "react"
import { useFABContext } from "./FABContext"

/** サブメニューFABを表示する */
export const SubMenuFAB = ({
  items,
  open,
  onToggle,
  defaultOpen = false,
  addBackButton = true,
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
  /** 戻るボタンを配列の最初に自動追加するか（デフォルトtrue） */
  addBackButton?: boolean
  /** 展開パターン（デフォルトは"hybrid-left"） */
  pattern?: "slide" | "radial-up" | "radial-left" | "hybrid-left"
}) => {
  const { isMobile } = useWindow()
  const router = useRouter()
  const { openFab, closeFab, isOpen } = useFABContext()

  /** FABContextを使った状態管理（外部制御されていない場合） */
  const isOpenFromContext = isOpen("submenu-fab")
  const finalOpen = open !== undefined ? open : isOpenFromContext

  /** トグル処理（NavigationFABを閉じる処理を追加） */
  const handleToggle = useCallback((willOpen: boolean) => {
    if (willOpen) {
      // SubMenuFABを開く時はNavigationFABを閉じる
      closeFab("navigation-fab")
      // 外部制御されていない場合はFABContextで管理
      if (open === undefined) {
        openFab("submenu-fab")
      }
    } else {
      // 外部制御されていない場合はFABContextで管理
      if (open === undefined) {
        closeFab("submenu-fab")
      }
    }
    // 外部のonToggleが指定されていれば呼び出す
    onToggle?.(willOpen)
  }, [closeFab, openFab, onToggle, open])

  /** 戻るボタンを含むアイテム配列を生成 */
  const finalItems = useMemo(() => {
    if (!addBackButton) return items

    const backButtonItem: FloatingActionItem = {
      icon: <IconArrowLeft size={20} />,
      label: "戻る",
      onClick: () => router.back(),
      color: "lime",
    }

    return [backButtonItem, ...items]
  }, [addBackButton, items, router])

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
        items={finalItems}
        pattern={pattern ?? "hybrid-left"}
        open={finalOpen}
        onToggle={handleToggle}
        defaultOpen={defaultOpen}
        mainIcon={<IconMenu size={24} />}
        showBackButton={false}
      />
    </div>
  )
}

"use client"

import { Button, ButtonProps } from "@mantine/core"
import { useRouter } from "next/navigation"
import { useLoadingContext } from "./LoadingContext"

type NavigationButtonProps = Omit<ButtonProps, "onClick"> & {
  /** 遷移先のURL */
  href: string
  /** ローディング状態を無視する（デフォルト: false） */
  ignoreLoading?: boolean
}

/**
 * 画面遷移専用のボタンコンポーネント
 * 
 * クリック時に自動的にグローバルローディング状態を開始し、
 * useRouterで画面遷移を実行する。
 * 遷移先の画面でScreenWrapperを使用することでローディングが自動停止される。
 * 
 * @example
 * <NavigationButton href="/quests/123">クエスト詳細</NavigationButton>
 */
export const NavigationButton = ({ 
  href,
  ignoreLoading = false,
  disabled,
  children, 
  ...props 
}: NavigationButtonProps) => {
  const router = useRouter()
  const { isLoading, startLoading } = useLoadingContext()

  const handleClick = () => {
    startLoading()
    router.push(href)
  }

  // ローディング中またはdisabledの場合はボタンを無効化
  const isDisabled = ignoreLoading ? disabled : (disabled || isLoading)

  return (
    <Button 
      {...props} 
      onClick={handleClick}
      disabled={isDisabled}
    >
      {children}
    </Button>
  )
}

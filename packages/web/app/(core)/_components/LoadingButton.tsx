"use client"

import { Button, ButtonProps } from "@mantine/core"
import { useLoadingContext } from "./LoadingContext"

type LoadingButtonProps = ButtonProps & {
  /** クリック時に実行する関数 */
  onClick?: () => void
  /** ローディング状態を無視する（デフォルト: false） */
  ignoreLoading?: boolean
}

/**
 * ローディング状態を考慮したボタンコンポーネント
 * 
 * クリック時に自動的にグローバルローディング状態を開始し、
 * ローディング中は押せないようにする
 */
export const LoadingButton = ({ 
  onClick, 
  ignoreLoading = false,
  disabled,
  children, 
  ...props 
}: LoadingButtonProps) => {
  const { isLoading, startLoading } = useLoadingContext()

  const handleClick = () => {
    if (onClick) {
      startLoading()
      onClick()
    }
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

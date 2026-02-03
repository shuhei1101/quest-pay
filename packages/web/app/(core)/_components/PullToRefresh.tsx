"use client"

import { ReactNode, useEffect, useState } from "react"
import ReactPullToRefresh from "react-pull-to-refresh"
import { Loader, Center } from "@mantine/core"
import { useWindow } from "../useConstants"

/** プル トゥ リフレッシュコンポーネントのプロパティ */
type PullToRefreshProps = {
  /** 子要素 */
  children: ReactNode
  /** リフレッシュ時のコールバック */
  onRefresh: () => Promise<void>
}

/** プル トゥ リフレッシュコンポーネント（モバイルのみ有効） */
export const PullToRefresh = ({
  children,
  onRefresh,
}: PullToRefreshProps) => {
  const { isMobile } = useWindow()
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  /** タッチデバイスかどうかを判定する */
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  /** モバイルかつタッチデバイス以外の場合は子要素をそのまま返す */
  if (!isMobile || !isTouchDevice) {
    return <>{children}</>
  }

  return (
    <ReactPullToRefresh
      onRefresh={onRefresh}
      resistance={3}
      icon={<div style={{ fontSize: '24px', textAlign: 'center' }}>↓</div>}
      loading={
        <Center>
          <Loader size="sm" />
        </Center>
      }
    >
      {children}
    </ReactPullToRefresh>
  )
}

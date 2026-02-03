"use client"

import { ReactNode } from "react"
import ReactPullToRefresh from "react-pull-to-refresh"
import { Loader, Center } from "@mantine/core"

/** プル トゥ リフレッシュコンポーネントのプロパティ */
type PullToRefreshProps = {
  /** 子要素 */
  children: ReactNode
  /** リフレッシュ時のコールバック */
  onRefresh: () => Promise<void>
}

/** プル トゥ リフレッシュコンポーネント */
export const PullToRefresh = ({
  children,
  onRefresh,
}: PullToRefreshProps) => {
  return (
    <ReactPullToRefresh
      onRefresh={onRefresh}
      loading={
        <Center>
          <Loader size="sm" />
        </Center>
      }
      icon={
        <Center>
          <Loader size="sm" />
        </Center>
      }
    >
      {children}
    </ReactPullToRefresh>
  )
}

"use client"

import { Loader, Box } from "@mantine/core"
import { useLoadingContext } from "./LoadingContext"

/** 画面左上に表示されるローディングインジケーター */
export const LoadingIndicator = () => {
  const { isLoading } = useLoadingContext()

  if (!isLoading) return null

  return (
    <Box
      style={{
        position: "fixed",
        top: 16,
        left: 16,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 48,
        height: 48,
        borderRadius: "50%",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Loader size="sm" color="white" />
    </Box>
  )
}

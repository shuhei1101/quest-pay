"use client"
import { ReactNode } from "react"
import { useWindow } from "../useConstants"

/** フローティングレイアウトコンポーネントを表示する */
export const FloatingLayout = ({
  children,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
}: {
  /** メインコンテンツ */
  children: ReactNode
  /** 左上に配置するボタン */
  topLeft?: ReactNode
  /** 右上に配置するボタン */
  topRight?: ReactNode
  /** 左下に配置するボタン */
  bottomLeft?: ReactNode
  /** 右下に配置するボタン */
  bottomRight?: ReactNode
}) => {
  const { isMobile } = useWindow()

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* メインコンテンツ */}
      {children}

      {/* 左上のボタン */}
      {topLeft && (
        <div
          style={{
            position: "fixed",
            top: isMobile ? "20px" : "20px",
            left: isMobile ? "20px" : "20px",
            zIndex: 3000,
          }}
        >
          {topLeft}
        </div>
      )}

      {/* 右上のボタン */}
      {topRight && (
        <div
          style={{
            position: "fixed",
            top: isMobile ? "20px" : "20px",
            right: isMobile ? "20px" : "20px",
            zIndex: 3000,
          }}
        >
          {topRight}
        </div>
      )}

      {/* 左下のボタン */}
      {bottomLeft && (
        <div
          style={{
            position: "fixed",
            bottom: isMobile ? "80px" : "40px",
            left: isMobile ? "20px" : "20px",
            zIndex: 3000,
          }}
        >
          {bottomLeft}
        </div>
      )}

      {/* 右下のボタン */}
      {bottomRight && (
        <div
          style={{
            position: "fixed",
            bottom: isMobile ? "80px" : "40px",
            right: isMobile ? "20px" : "40px",
            zIndex: 3000,
          }}
        >
          {bottomRight}
        </div>
      )}
    </div>
  )
}

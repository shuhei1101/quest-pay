"use client"

import { ReactNode, useEffect, useState } from "react"
import { LoadingOverlay, Title } from "@mantine/core";
import { FeedbackMessageWrapper } from "../../(shared)/_components/FeedbackMessageWrapper";
import Header from "../../(shared)/_components/Header";
import { useDisclosure } from "@mantine/hooks";
import { RegisterNamePopup } from "./RegisterNamePopup";
import { useLoginUserInfo } from "../_hooks/useLoginUserInfo";
import { useRouter } from "next/navigation";
import { AUTH_ERROR_URL } from "../../(core)/appConstants";

/** 認証済みのページに適用するレイアウト */
export const AuthorizedPageLayout = ({ children, title, actionButtons, requireAdmin, guestNG }: {
  title: string
  actionButtons?: ReactNode
  children: ReactNode
  requireAdmin?: boolean
  guestNG?: boolean
}) => {
  const router = useRouter()

  /** 名前入力ポップアッププロパティ */
  const [popupOpened, { open: openPopup, close: closePopup }] = useDisclosure(false);

  /** ログインユーザ情報 */
  const {userId, userInfo, isLoading, isAdmin, isGuest} = useLoginUserInfo()

  // 画面の権限チェックを行う
  const [redirected, setRedirected] = useState(false)
  useEffect(() => {
    if (isLoading || redirected) return

    // 管理者権限が必要な場合
    if (requireAdmin && !isAdmin) {
      router.push(AUTH_ERROR_URL)
      setRedirected(true)
      return
    }

    // ゲスト禁止画面の場合
    if (guestNG && isGuest) {
      router.push(AUTH_ERROR_URL)
      setRedirected(true)
      return
    }

    if (!userInfo) {
      openPopup()
    }
  }, [isLoading, isAdmin, isGuest, requireAdmin, guestNG, userInfo, router, redirected])

  
  return (
    <>
    {/* ロード中のオーバーレイ */}
    <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 0 }}
    loaderProps={{ children: ' ' }} />
    {/* フィードバックメッセージラッパー */}
    <FeedbackMessageWrapper>
      {/* ヘッダー */}
      <Header />
      <div className="m-3" />
      <div className="m-3">
      <div className="flex">
        {/* タイトル */}
        <Title order={2} className="text-blue-500">
          {title}
        </Title>
        <div className="flex-1" />
        {/* アクションボタン（左側のボタン群） */}
        {actionButtons}
      </div>
      <div className="m-3" />
        {/* 子コンポーネント */}
        {children}
      </div>
      <RegisterNamePopup close={closePopup} opened={popupOpened} userId={userId!} />
    </FeedbackMessageWrapper>
    </>
  )
}

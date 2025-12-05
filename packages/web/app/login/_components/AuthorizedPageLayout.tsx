"use client"

import { ReactNode, useEffect, useState } from "react"
import { LoadingOverlay, Title } from "@mantine/core";
import { FeedbackMessageWrapper } from "../../(core)/_components/FeedbackMessageWrapper";
import Header from "../../(core)/_components/Header";
import { useDisclosure } from "@mantine/hooks";
import { useLoginUserInfo } from "../_hooks/useLoginUserInfo";
import { useRouter } from "next/navigation";

/** 認証済みのページに適用するレイアウト */
export const AuthorizedPageLayout = ({ children, title, actionButtons, requiredParent, requiredChild }: {
  title: string
  actionButtons?: ReactNode
  children: ReactNode
  requiredParent?: boolean
  requiredChild?: boolean
}) => {
  const router = useRouter()

  /** 名前入力ポップアッププロパティ */
  const [popupOpened, { open: openPopup, close: closePopup }] = useDisclosure(false);

  /** ログインユーザ情報 */
  const { userInfo, isLoading, session } = useLoginUserInfo()

  // 画面の権限チェックを行う
  const [redirected, setRedirected] = useState(false)
  useEffect(() => {
    if (isLoading || redirected) return

    // // 親専用画面の場合
    // if (requiredParent && userInfo?.type !== "parent" ) {
    //   router.push(AUTH_ERROR_URL)
    //   setRedirected(true)
    //   return
    // }

    // // 子供専用画面の場合
    // if (requiredChild && userInfo?.type !== "child") {
    //   router.push(AUTH_ERROR_URL)
    //   setRedirected(true)
    //   return
    // }

    if (!userInfo) {
      openPopup()
    }
  }, [isLoading, requiredParent, requiredChild, userInfo, router, redirected])

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
    </FeedbackMessageWrapper>
    </>
  )
}

"use client"

import { ReactNode, useEffect } from "react";
import { appStorage } from "../../(core)/_sessionStorage/appStorage";
import { Toaster } from "react-hot-toast";

// トースターメッセージを表示するためのプロバイダ
export const FeedbackMessageWrapper = ({children}: {children: ReactNode;}) => {
  // レンダリング時の処理
  useEffect(() => {
    // セッションストレージにメッセージがある場合、表示する
    appStorage.feedbackMessage.out();
  }, []);

  return (
    <>
      {children}
      <Toaster />
    </>
  )
}

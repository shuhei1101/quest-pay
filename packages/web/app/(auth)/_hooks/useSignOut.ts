"use client"
import { appStorage } from "../../(core)/_sessionStorage/appStorage";
import { useRouter } from "next/navigation";
import { LOGIN_URL } from "@/app/(core)/endpoints";
import { createClient } from "@/app/(core)/_supabase/client";

/** サインアウト時の処理 */
export const useSignOut = () => {
  const router = useRouter()
  
  const signout = async () => {
    const { error } = await createClient().auth.signOut();

   // ログインしていない場合のハンドル
    if (error) {
      // 次画面で表示するメッセージを登録する
      appStorage.feedbackMessage.set({ message: "サインアウト中にエラーが発生しました。", type: "error" })
    } else {
      // 次画面で表示するメッセージを登録する
      appStorage.feedbackMessage.set({ message: "サインアウトしました。", type: "success" })
    }
    router.push(`${LOGIN_URL}`)
  }
  return {signout}
}

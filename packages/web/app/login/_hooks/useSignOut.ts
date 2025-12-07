"use client"
import { appStorage } from "../../(core)/_sessionStorage/appStorage";
import { useRouter } from "next/navigation";
import { LOGIN_URL } from "@/app/(core)/constants";
import { createClient } from "@/app/(core)/_supabase/client";

/** サインアウト時の処理 */
export const useSignOut = () => {
  const router = useRouter()
  
  const signout = async () => {
    const { error } = await createClient().auth.signOut();

   // ログインしていない場合のハンドル
    if (error) {
      // 次画面で表示するメッセージを登録する
      appStorage.feedbackMessage.set('サインアウト中にエラーが発生しました。')
    } else {
      // 次画面で表示するメッセージを登録する
      appStorage.feedbackMessage.set('サインアウトしました。')
    }
    router.push(`${LOGIN_URL}`)
  }
  return {signout}
}

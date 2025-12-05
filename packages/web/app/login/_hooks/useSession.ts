"use client"
import { appStorage } from "../../(core)/_sessionStorage/appStorage"
import { useRouter } from "next/navigation"
import { LOGIN_URL } from "@/app/(core)/constants"
import { createClient } from "@/app/(core)/_supabase/client"
import { useQuery } from '@tanstack/react-query';

export const useSession = () => {
  const router = useRouter()

  const query = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      // 現在のセッション状態を取得する
      const { data } = await createClient().auth.getSession()
      // セッション状態がない場合
      if (!data.session) {
        // フィードバックメッセージを表示する
        appStorage.feedbackMessage.set("セッションが切れました。再度ログインしてください。")
        // ログイン画面に遷移する
        router.push(LOGIN_URL)
        throw new Error("セッションなし")
      }

      return data.session
    },
    retry: false
  })
  return {
    session: query.data,
    isLoading: query.isLoading
  }
}

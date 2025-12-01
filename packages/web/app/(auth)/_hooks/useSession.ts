"use client"
import { clientSupabase } from "@/app/(core)/_supabase/clientSupabase";
import { appStorage } from "../../(core)/_sessionStorage/appStorage";
import { useRouter } from "next/navigation";
import { LOGIN_URL } from "@/app/(core)/appConstants";
import { useEffect, useState } from "react";
import { Session } from '@supabase/supabase-js';

export const useSession = () => {
  const router = useRouter()
  const [session, setSession] = useState<Session>()
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    /** 現在の認証状態を確認する */
    const getSession = async () => {
      // セッションストレージからセッション情報を取得する
      let session = appStorage.supabaseSession.get()
      if (!session) {
        const { data } = await clientSupabase.auth.getSession();
        // ログインに失敗した場合
        if (!data.session) {
          // 次画面で表示するメッセージを登録する
          appStorage.feedbackMessage.set('セッションが切れました。再度ログインしてください。')
            
          // ログイン画面に戻る
          router.push(`${LOGIN_URL}`)
          return undefined
        }
        // ログインに成功した場合、セッションストレージに格納する
        session = data.session
        appStorage.supabaseSession.set(session)
      }
      
      return session
    }
    getSession().then((s) => {
      setSession(s)
      // ロード状態を解除する
      setIsLoading(false)
    })
    
  }, [])
  return { 
    session,
    isLoading
   }
}

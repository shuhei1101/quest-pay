import { RawUser } from "@/app/(user)/_schema/userSchema";
import toast from "react-hot-toast";

export const appStorage = {
  // フィードバックメッセージ
  feedbackMessage: {
    /** メッセージを出力する */
    out: () => {
      const message = sessionStorage.getItem('feedbackMessage');
      if (message) {
        toast(message, {duration: 1500});
        sessionStorage.removeItem('feedbackMessage');
      }
    },
    /** メッセージをセットする */
    set: (message: string) => {
      sessionStorage.setItem('feedbackMessage', message);
    }
  },
  // 親画面
  parentScreen: {
    /** 親画面のURLを取得する */
    get: () => {
      return sessionStorage.getItem("parentScreen");
    },
    /** 親画面のURLをセットする */
    set: (url: string) => {
      sessionStorage.setItem("parentScreen", url);
    },
    /** 親画面のURLを破棄する */
    remove: () => {
      sessionStorage.removeItem("parentScreen");
    }
  },
  // Supabaseセッション状態
  supabaseSession: {
    get: () => {
      const cached = sessionStorage.getItem("supabaseSession")
      return cached ? JSON.parse(cached) : undefined
    },
    set: (data: any) => sessionStorage.setItem("supabaseSession", JSON.stringify(data))
  },
  // ユーザ情報
  user: {
    get: () => {
      const cached = sessionStorage.getItem("user")
      return cached ? JSON.parse(cached) as RawUser : undefined
    },
    set: (data: RawUser) => sessionStorage.setItem("user", JSON.stringify(data))
  }
}

import { IconCategoryEntity, IconCategoryEntitySchema } from "@/app/(app)/icons/category/entity"
import { IconWithCategoryView, IconWithCategoryViewSchema } from "@/app/(app)/icons/view"
import { QuestCategoryEntity, QuestCategoryEntitySchema } from "@/app/api/quests/category/entity"
import { UserInfoView } from "@/app/api/users/view"
import toast from "react-hot-toast"

export const appStorage = {
  // フィードバックメッセージ
  feedbackMessage: {
    /** メッセージを出力する */
    out: () => {
      const message = sessionStorage.getItem('feedbackMessage')
      if (message) {
        toast(message, {duration: 1500})
        sessionStorage.removeItem('feedbackMessage')
      }
    },
    /** メッセージをセットする */
    set: (message: string) => {
      sessionStorage.setItem('feedbackMessage', message)
    }
  },
  // 親画面
  parentScreen: {
    /** 親画面のURLを取得する */
    get: () => {
      return sessionStorage.getItem("parentScreen")
    },
    /** 親画面のURLをセットする */
    set: (url: string) => {
      sessionStorage.setItem("parentScreen", url)
    },
    /** 親画面のURLを破棄する */
    remove: () => {
      sessionStorage.removeItem("parentScreen")
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
      return cached ? JSON.parse(cached) as UserInfoView : undefined
    },
    set: (data: UserInfoView) => sessionStorage.setItem("user", JSON.stringify(data))
  },
  // アイコン情報
  icons: {
    /** アイコンを取得する */
    get: () => {
      const icons = sessionStorage.getItem("icons")
      return icons ? IconWithCategoryViewSchema.array().parse(JSON.parse(icons)) : []
    },
    /** アイコンをセットする */
    set: (icons: IconWithCategoryView[]) => {
      sessionStorage.setItem('icons', JSON.stringify(icons))
    },
  },
  // アイコンカテゴリ情報
  iconCategories: {
    /** アイコンカテゴリを取得する */
    get: () => {
      const iconCategories = sessionStorage.getItem("iconCategories")
      return iconCategories ? IconCategoryEntitySchema.array().parse(JSON.parse(iconCategories)) : []
    },
    /** アイコンカテゴリをセットする */
    set: (iconCategories: IconCategoryEntity[]) => {
      sessionStorage.setItem('iconCategories', JSON.stringify(iconCategories))
    },
  },
  // クエストカテゴリ情報
  questCategories: {
    /** クエストカテゴリを取得する */
    get: () => {
      const questCategories = sessionStorage.getItem("questCategories")
      return questCategories ? QuestCategoryEntitySchema.array().parse(JSON.parse(questCategories)) : []
    },
    /** クエストカテゴリをセットする */
    set: (questCategories: QuestCategoryEntity[]) => {
      sessionStorage.setItem('questCategories', JSON.stringify(questCategories))
    },
  },
}

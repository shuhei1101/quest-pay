import { IconCategoryEntity, IconCategoryEntityScheme } from "@/app/api/icons/category/entity"
import { IconById, IconByIdScheme, IconEntity, IconEntityScheme } from "@/app/api/icons/entity"
import { QuestCategoryById, QuestCategoryByIdScheme, QuestCategoryEntity, QuestCategoryEntityScheme } from "@/app/api/quests/category/entity"
import { UserInfoView } from "@/app/api/users/view"
import toast from "react-hot-toast"

type FeedbackParams = {
  message: string,
  type?: 'success' | 'error'
}

export const appStorage = {
  // フィードバックメッセージ
  feedbackMessage: {
    /** メッセージを出力する */
    out: () => {
      const data = sessionStorage.getItem('feedbackMessage')
      const params: FeedbackParams | null = data ? JSON.parse(data) : null
      if (params) {
        if (!params.type) toast(params.message)
        else if (params.type === 'success') toast.success(params.message)
        else if (params.type === 'error') toast.error(params.message)
        sessionStorage.removeItem('feedbackMessage')
      }
    },
    /** メッセージをセットする */
    set: (params: FeedbackParams) => {
      sessionStorage.setItem('feedbackMessage', JSON.stringify(params))
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
      return icons ? IconEntityScheme.array().parse(JSON.parse(icons)) : []
    },
    /** アイコンをセットする */
    set: (icons: IconEntity[]) => {
      sessionStorage.setItem('icons', JSON.stringify(icons))
    },
  },
  // アイコン辞書
  iconById: {
    /** アイコン辞書を取得する */
    get: () => {
      const iconById = sessionStorage.getItem("iconById")
      return iconById ? IconByIdScheme.parse(JSON.parse(iconById)) : undefined
    },
    /** アイコン辞書をセットする */
    set: (iconById: IconById) => {
      sessionStorage.setItem('iconById', JSON.stringify(iconById))
    },
  },
  // アイコンカテゴリ情報
  iconCategories: {
    /** アイコンカテゴリを取得する */
    get: () => {
      const iconCategories = sessionStorage.getItem("iconCategories")
      return iconCategories ? IconCategoryEntityScheme.array().parse(JSON.parse(iconCategories)) : []
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
      return questCategories ? QuestCategoryEntityScheme.array().parse(JSON.parse(questCategories)) : []
    },
    /** クエストカテゴリをセットする */
    set: (questCategories: QuestCategoryEntity[]) => {
      sessionStorage.setItem('questCategories', JSON.stringify(questCategories))
    },
  },
  // クエストカテゴリ辞書
  questCategoryById: {
    /** クエストカテゴリ辞書を取得する */
    get: () => {
      const questCategoryById = sessionStorage.getItem("questCategoryById")
      return questCategoryById ? QuestCategoryByIdScheme.parse(JSON.parse(questCategoryById)) : undefined
    },
    /** クエストカテゴリ辞書をセットする */
    set: (questCategoryById: QuestCategoryById) => {
      sessionStorage.setItem('questCategoryById', JSON.stringify(questCategoryById))
    },
  },
}

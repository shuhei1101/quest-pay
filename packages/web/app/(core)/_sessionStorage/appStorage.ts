import { IconById } from "@/app/api/icons/service"
import { QuestCategoryById } from "@/app/api/quests/category/service"
import type { UserInfo } from "@/app/api/users/query"
import type { IconCategorySelect, IconSelect, QuestCategorySelect } from "@/drizzle/schema"
import toast from "react-hot-toast"
import { devLog } from "../util"
import { FamilyQuestFormType } from "@/app/(app)/quests/family/[id]/form"

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
        if (!params.type) toast(params.message, { duration: 2000 })
        else if (params.type === 'success') toast.success(params.message, { duration: 2000 })
        else if (params.type === 'error') toast.error(params.message, { duration: 2000 })
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
      return cached ? JSON.parse(cached) as UserInfo : undefined
    },
    set: (data: UserInfo) => sessionStorage.setItem("user", JSON.stringify(data))
  },
  // アイコン情報
  icons: {
    /** アイコンを取得する */
    get: () => {
      const icons = sessionStorage.getItem("icons")
      return icons ? JSON.parse(icons) as IconSelect[] : []
    },
    /** アイコンをセットする */
    set: (icons: IconSelect[]) => {
      sessionStorage.setItem('icons', JSON.stringify(icons))
    },
  },
  // アイコン辞書
  iconById: {
    /** アイコン辞書を取得する */
    get: () => {
      const iconById = sessionStorage.getItem("iconById")
      return iconById ? JSON.parse(iconById) as IconById : undefined
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
      return iconCategories ? JSON.parse(iconCategories) as IconCategorySelect[] : []
    },
    /** アイコンカテゴリをセットする */
    set: (iconCategories: IconCategorySelect[]) => {
      sessionStorage.setItem('iconCategories', JSON.stringify(iconCategories))
    },
  },
  // クエストカテゴリ情報
  questCategories: {
    /** クエストカテゴリを取得する */
    get: () => {
      const questCategories = sessionStorage.getItem("questCategories")
      return questCategories ? JSON.parse(questCategories) as QuestCategorySelect[] : []
    },
    /** クエストカテゴリをセットする */
    set: (questCategories: QuestCategorySelect[]) => {
      sessionStorage.setItem('questCategories', JSON.stringify(questCategories))
    },
  },
  // クエストカテゴリ辞書
  questCategoryById: {
    /** クエストカテゴリ辞書を取得する */
    get: () => {
      const questCategoryById = sessionStorage.getItem("questCategoryById")
      devLog("appStorage.questCategoryById.get.取得クエストカテゴリ辞書: ", questCategoryById)
      return questCategoryById ? JSON.parse(questCategoryById) as QuestCategoryById : undefined
    },
    /** クエストカテゴリ辞書をセットする */
    set: (questCategoryById: QuestCategoryById) => {
      sessionStorage.setItem('questCategoryById', JSON.stringify(questCategoryById))
    },
  },
  // 家族クエスト作成画面フォームのデータ
  familyQuestForm: {
    /** 家族クエストフォームを取得する（取得後に破棄） */
    pop: () => {
      const data = sessionStorage.getItem("familyQuestForm")
      sessionStorage.removeItem("familyQuestForm")
      return data ? JSON.parse(data) as FamilyQuestFormType : undefined
    },
    /** 家族クエストフォームをセットする */
    set: (questData: FamilyQuestFormType) => {
      sessionStorage.setItem('familyQuestForm', JSON.stringify(questData))
    },
  },
}

/** ２つの配列の値が等しいか確認する（順不同） */
export const isSameArray = (a: string[], b: string[]) => {
  // 配列のサイズが違う場合はFalse
  if (a.length !== b.length) return false;

  const set = new Set(a);
  return b.every((item) => set.has(item));
}

/** スタックトレースを配列に変換する */
const stackToArray = (stack: string): string[] => {
  if (!stack) return [];
  return stack.split("\n").map((line) => line.trim())
}

/** 開発時ログを出力する */
export const devLog = (text: string, obj?: unknown, path?: string) => {
  if (process.env.NODE_ENV !== "development") return

  try {
    let logObj = obj

    if (typeof obj === 'string') {
      try {
        logObj = JSON.parse(obj)
      } catch {
        // パースできなければそのまま文字列
        logObj = obj
      }
    }

    // ZodErrorの場合はissuesを整形して表示する
    if (obj && typeof obj === 'object' && 'name' in obj && obj.name === 'ZodError' && 'issues' in obj) {
      logObj = {
        name: obj.name,
        issues: obj.issues,
      }
    }
    // Errorオブジェクトの場合はスタックトレースを配列化する
    else if (obj instanceof Error) {
      logObj = {
        name: obj.name,
        message: obj.message,
        stack: obj.stack ? stackToArray(obj.stack) : [],
      }
    }

    if (logObj === undefined) {
      console.log(`【DEBUG】${getJstTimestamp()}`, path ? `[${path}]->` : "", `${text}`)
    } else {
      console.log(`【DEBUG】${getJstTimestamp()}`, path ? `[${path}]->` : "", `${text}`, logObj)
    }
  } catch (e) {
    console.log(`【DEBUG】${getJstTimestamp()}`, path ? `[${path}]->` : "", `${text}`, obj ?? "")
  }
}

const CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
/** 招待コードを生成する */
export const generateInviteCode = (length = 8) => {
  let code = "";
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  for (let i = 0; i < length; i++) {
    const index = array[i] % CHARS.length;
    code += CHARS[index];
  }

  return code;
};

/** 現在日時(JST)を取得する */
export const getJstTimestamp = () => {
  const date = new Date();
  // 日本時間に変換しフォーマットを整える
  return date.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Tokyo",
  }).replace(/\//g, "-")
}

/** ページネーション用の値を計算する */
export const calculatePagination = (params: {
  page?: number, 
  pageSize?: number
}) => {
  const page = Math.max(1, params.page ?? 1)
  const pageSize = Math.min(100, params.pageSize ?? 20)
  const offset = (page - 1) * pageSize
  return { pageSize, offset }
}

/** 相対時間を表示する */
export const formatRelativeTime = (dateString?: string | null) => {
  if (!dateString) return ""
  
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffMins < 1) return "たった今"
  if (diffHours < 1) return `${diffMins}分前`
  if (diffDays < 1) return `${diffHours}時間前`
  if (diffDays < 7) return `${diffDays}日前`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}週間前`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}ヶ月前`
  return `${Math.floor(diffDays / 365)}年前`
}

/** 年齢範囲を表示する */
export const formatAgeRange = (ageFrom?: number | null, ageTo?: number | null) => {
  if (ageFrom == null && ageTo == null) return "全年齢"
  if (ageFrom != null && ageTo != null) return `${ageFrom}歳〜${ageTo}歳`
  if (ageFrom != null) return `${ageFrom}歳以上`
  if (ageTo != null) return `${ageTo}歳以下`
  return "全年齢"
}

/** 月範囲を表示する */
export const formatMonthRange = (monthFrom?: number | null, monthTo?: number | null) => {
  if (monthFrom == null && monthTo == null) return null
  if (monthFrom != null && monthTo != null) return `${monthFrom}月〜${monthTo}月`
  if (monthFrom != null) return `${monthFrom}月以降`
  if (monthTo != null) return `${monthTo}月まで`
  return null
}

/** 生年月日から年齢を計算する */
export const calculateAge = (birthday: string | null | undefined): number | null => {
  if (!birthday) return null
  
  const birthDate = new Date(birthday)
  // 無効な日付をチェックする
  if (isNaN(birthDate.getTime())) return null
  
  const today = new Date()
  
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

/** 日付を YYYY/MM/DD 形式でフォーマットする */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return ""
  
  const date = new Date(dateString)
  // 無効な日付をチェックする
  if (isNaN(date.getTime())) return ""
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  
  return `${year}/${month}/${day}`
}

/** 時刻を HH:MM 形式でフォーマットする */
export const formatTime = (dateString: string | null | undefined): string => {
  if (!dateString) return ""
  
  const date = new Date(dateString)
  // 無効な日付をチェックする
  if (isNaN(date.getTime())) return ""
  
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  
  return `${hours}:${minutes}`
}


/** URLにクエリパラメータを付与する */
export const addQueryParam = (url: string, key: string, value: string) => {
  const encodedValue = encodeURIComponent(value)
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}${key}=${encodedValue}`
}

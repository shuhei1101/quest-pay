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

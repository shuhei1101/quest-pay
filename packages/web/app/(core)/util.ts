/** ２つの配列の値が等しいか確認する（順不同） */
export const isSameArray = (a: string[], b: string[]) => {
  // 配列のサイズが違う場合はFalse
  if (a.length !== b.length) return false;

  const set = new Set(a);
  return b.every((item) => set.has(item));
}

/** 開発時ログ */
export const devLog = (text: string, obj?: unknown) => {
  if (process.env.NODE_ENV !== "development") return;

  try {
    let logObj = obj;

    if (typeof obj === 'string') {
      try {
        logObj = JSON.parse(obj);
      } catch {
        // パースできなければそのまま文字列
        logObj = obj;
      }
    }

    if (logObj === undefined) {
      console.log(`【DEBUG】${getJstTimestamp()} ${text}`);
    } else {
      console.log(`【DEBUG】${getJstTimestamp()} ${text}`, logObj);
    }
  } catch (e) {
    console.log(`【DEBUG】${getJstTimestamp()} ${text}`, obj ?? "");
  }
};

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

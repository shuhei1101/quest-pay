/** ２つの配列の値が等しいか確認する（順不同） */
export const isSameArray = (a: string[], b: string[]) => {
  // 配列のサイズが違う場合はFalse
  if (a.length !== b.length) return false;

  const set = new Set(a);
  return b.every((item) => set.has(item));
}

/** 開発時ログ */
export const devLog = (text: string, obj?: unknown) => {
  if (process.env.NODE_ENV === "development") {
    try {
      console.log(text, obj !== undefined ? JSON.stringify(obj, null, 2) : '')
    } catch {
      console.log(text, obj)
    }
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

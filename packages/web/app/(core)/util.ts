/** ２つの配列の値が等しいか確認する（順不同） */
export const isSameArray = (a: string[], b: string[]) => {
  // 配列のサイズが違う場合はFalse
  if (a.length !== b.length) return false;

  const set = new Set(a);
  return b.every((item) => set.has(item));
}

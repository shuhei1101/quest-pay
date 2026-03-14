import { CHILD_API_URL, CHILDREN_API_URL } from "@/app/(core)/endpoints";
import { AppError } from "@/app/(core)/error/appError";
import type { GetChildResponse } from "./route";

/** 子供をGETする */
export const getChild = async (childId: string) => {
  // APIを実行する
  const res = await fetch(`${CHILD_API_URL(childId)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const data = await res.json()

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) throw AppError.fromResponse(data, res.status)


  return data as GetChildResponse
}

import { CHILD_API_URL, CHILDREN_API_URL } from "@/app/(core)/endpoints";
import { devLog } from "@/app/(core)/util";
import { AppError } from "@/app/(core)/error/appError";
import type { GetChildResponse } from "./route";

/** 子供をGETする */
export const getChild = async (childId: string) => {
  devLog("getChild.API呼び出し: ", {URL: CHILD_API_URL(childId)})
  // APIを実行する
  const res = await fetch(`${CHILD_API_URL(childId)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const data = await res.json()

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) throw AppError.fromResponse(data, res.status)

  devLog("getChild.戻り値: ", data)

  return data as GetChildResponse
}

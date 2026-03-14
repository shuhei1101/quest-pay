import queryString from "query-string"
import { ICONS_API_URL } from "@/app/(core)/endpoints";
import { AppError } from "@/app/(core)/error/appError";
import type { GetIconsResponse } from "./route";

/** 家族クエストをGETする */
export const getIcons = async () => {
  // APIを実行する
  const res = await fetch(`${ICONS_API_URL}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const data = await res.json()

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    throw AppError.fromResponse(data, res.status)
  }


  return data as GetIconsResponse
}

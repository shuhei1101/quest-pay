import { ICON_CATEGORIES_API_URL } from "@/app/(core)/endpoints";
import { devLog } from "@/app/(core)/util";
import { AppError } from "@/app/(core)/error/appError";
import type { GetIconCategoriesResponse } from "./route";

/** 家族クエストをGETする */
export const getIconCategories = async () => {
  devLog("getIconCategories.API呼び出し: ", {URL: ICON_CATEGORIES_API_URL})
  // APIを実行する
  const res = await fetch(`${ICON_CATEGORIES_API_URL}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const data = await res.json()

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    throw AppError.fromResponse(data, res.status)
  }

  devLog("getIconCategories.戻り値: ", data)

  return data as GetIconCategoriesResponse
}

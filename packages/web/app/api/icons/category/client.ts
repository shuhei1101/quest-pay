import { ICON_CATEGORIES_API_URL } from "@/app/(core)/constants";
import { devLog } from "@/app/(core)/util";
import { AppError } from "@/app/(core)/error/appError";
import { GetIconCategoriesResponseScheme } from "./scheme";

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

  return GetIconCategoriesResponseScheme.parse(data)
}

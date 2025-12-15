import { CHILD_JOIN_API_URL } from "@/app/(core)/constants";
import { AppError } from "@/app/(core)/error/appError";
import { JoinChildRequest, JoinChildRequestScheme } from "./scheme";

export const postJoinChild = async (request: JoinChildRequest) => {
  // APIを実行する
  const res = await fetch(`${CHILD_JOIN_API_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }
}

import { ALLOWANCE_TABLES_API_URL } from "@/app/(core)/endpoints"
import { devLog } from "@/app/(core)/util"
import { AppError } from "@/app/(core)/error/appError"
import type { GetAllowanceTablesResponse, PutAllowanceTablesRequest, PutAllowanceTablesResponse } from "./route"

/** お小遣いテーブルをGETする */
export const getAllowanceTables = async () => {
  devLog("getAllowanceTables.API呼び出し: ", { URL: ALLOWANCE_TABLES_API_URL })
  
  // APIを実行する
  const res = await fetch(`${ALLOWANCE_TABLES_API_URL}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const data = await res.json()

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    throw AppError.fromResponse(data, res.status)
  }
  devLog("getAllowanceTables.戻り値: ", data)

  return data as GetAllowanceTablesResponse
}

/** お小遣いテーブルをPUTする */
export const putAllowanceTables = async (request: PutAllowanceTablesRequest) => {
  devLog("putAllowanceTables.API呼び出し: ", { URL: ALLOWANCE_TABLES_API_URL, request })
  
  // APIを実行する
  const res = await fetch(`${ALLOWANCE_TABLES_API_URL}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  })

  // ステータスが不正な場合、アプリ例外を発生させる
  if (!res.ok) {
    devLog("putAllowanceTables.API実行失敗: ", res)
    const data = await res.json()
    throw AppError.fromResponse(data, res.status)
  }
  const data = await res.json()
  devLog("putAllowanceTables.戻り値: ", data)

  return data as PutAllowanceTablesResponse
}

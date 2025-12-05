import { NextRequest, NextResponse } from "next/server"
import { handleServerError } from "@/app/(core)/errorHandler"
import { fetchFamily } from "@/app/api/families/query"

/** 家族を取得する */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    // パスパラメータからIDを取得する
    const id = params.id

    // 家族を取得する
    const quest = await fetchFamily(id)

    return NextResponse.json(quest)
  } catch (err) {
    return handleServerError(err)
  }
}

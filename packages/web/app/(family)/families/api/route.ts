import { NextRequest, NextResponse } from "next/server"
import { FamilyDelete, FamilyDeleteSchema, FamilyInsert, FamilyInsertSchema, FamilyUpdate, FamilyUpdateSchema } from "../../_schema/familySchema"
import { handleServerError } from "@/app/(core)/errorHandler"
import { familyDao } from "../../_data-access/familyDao"
import { FamilyCreateRequestSchema } from "./schema"

/** 家族を登録する */
export async function POST(
  request: NextRequest,
) {
  try {
    // bodyから家族を取得する
    const body = await request.json()
    const data = FamilyCreateRequestSchema.parse(body)

    // 家族を登録する
    await familyDao.insert({
      family: {
        display_id: data.form.displayId,
        local_name: data.form.localName,
        icon: data.form.familyIcon,
        online_name: data.form.onlineName
      },
      parent: {
        birthday: data.form.parentBirthday,
        icon: data.form.parentIcon,
        name: data.form.parentName,
        user_id: data.userId
      },
    })

    // 作成された家族のIDを返却する
    return NextResponse.json({})
  } catch (err) {
    return handleServerError(err)
  }
}

/** 家族を更新する */
export async function PUT(
  request: NextRequest,
) {
  try {
    // bodyから家族を取得する
    const body: FamilyUpdate = await request.json()
    const family = FamilyUpdateSchema.parse(body)

    // 家族を更新する
    await familyDao.update(family)
    
    // メッセージを返却する
    return NextResponse.json({})
  } catch (err) {
    return handleServerError(err)
  }
}

/** 家族を削除する */
export async function DELETE(
  request: NextRequest,
) {
  try {
    // bodyから家族を取得する
    const body: FamilyDelete = await request.json()
    const family = FamilyDeleteSchema.parse(body)

    // 家族を削除する
    await familyDao.delete(family)

    return NextResponse.json({})
  } catch (err) {
    return handleServerError(err)
  }
}

import { NextRequest, NextResponse } from "next/server";
import { FamilyDelete, FamilyInsert, FamilyUpdate } from "../../_schema/familySchema";
import { handleServerError } from "@/app/(core)/errorHandler";
import { familyDao } from "../../_data-access/familyDao";

/** 家族を登録する */
export async function POST(
  request: NextRequest,
) {
  try {
    // bodyから家族を取得する
    const body: FamilyInsert = await request.json()
    const family  = FamilyInsert.parse(body);

    // 家族を登録する
    const id = await familyDao.insert(family);

    const response = {
      id: id,
    }

    // 作成された家族のIDを返却する
    return NextResponse.json(response);
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
    const family = FamilyUpdate.parse(body);

    // 家族を更新する
    await familyDao.update(family)
    
    // メッセージを返却する
    return NextResponse.json({});
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
    const family = body as FamilyDelete

    // 家族を削除する
    await familyDao.delete(family)

    return NextResponse.json({});
  } catch (err) {
    return handleServerError(err)
  }
}

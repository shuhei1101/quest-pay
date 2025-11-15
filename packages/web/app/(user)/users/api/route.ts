import { NextRequest, NextResponse } from "next/server";
import { UserFormSchema, userFormSchema } from "../../_schema/userSchema";
import { createUser } from "../../_service/createUser";
import { updateUser } from "../../_service/updateUser";
import { deleteUser } from "../../_service/deleteUser";
import { handleServerError } from "@/app/(core)/errorHandler";

export type RegisterUserRequest = UserFormSchema;
export type RegisterUserResponse = { id: number }
/** ユーザを登録する */
export async function POST(
  request: NextRequest,
) {
  try {
    // bodyからユーザを取得する
    const body: RegisterUserRequest = await request.json()
    const user  = userFormSchema.parse(body);

    // ユーザを登録する
    const id = await createUser(user);

    const response: RegisterUserResponse = {
      id: id,
    }

    // 作成されたユーザのIDを返却する
    return NextResponse.json(response);
  } catch (err) {
    return handleServerError(err)
  }
}

/** ユーザを更新する */
export async function PUT(
  request: NextRequest,
) {
  try {
    // bodyからユーザを取得する
    const body: RegisterUserRequest = await request.json()
    const user = userFormSchema.parse(body);

    // ユーザを更新する
    await updateUser(user)
    
    // メッセージを返却する
    return NextResponse.json({});
  } catch (err) {
    return handleServerError(err)
  }
}

/** ユーザを削除する */
export async function DELETE(
  request: NextRequest,
) {
  try {
    // bodyからユーザを取得する
    const body: RegisterUserRequest = await request.json()
    const user = body as UserFormSchema

    // ユーザを削除する
    await deleteUser(user)

    return NextResponse.json({});
  } catch (err) {
    return handleServerError(err)
  }
}

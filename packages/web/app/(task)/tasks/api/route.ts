import { NextRequest, NextResponse } from "next/server";
import { TaskFormSchema, taskFormSchema } from "../../_schema/taskSchema";
import { createTask } from "../../_service/createTask";
import { updateTask } from "../../_service/updateTask";
import { deleteTask } from "../../_service/deleteTask";
import { handleServerError } from "@/app/(core)/errorHandler";

export type RegisterTaskRequest = TaskFormSchema;
export type RegisterTaskResponse = { id: number }
/** タスクを登録する */
export async function POST(
  request: NextRequest,
) {
  try {
    // bodyからタスクを取得する
    const body: RegisterTaskRequest = await request.json()
    const task  = taskFormSchema.parse(body);

    // タスクを登録する
    const id = await createTask(task);

    const response: RegisterTaskResponse = {
      id: id,
    }

    // 作成されたタスクのIDを返却する
    return NextResponse.json(response);
  } catch (err) {
    return handleServerError(err)
  }
}

/** タスクを更新する */
export async function PUT(
  request: NextRequest,
) {
  try {
    // bodyからタスクを取得する
    const body: RegisterTaskRequest = await request.json()
    const task = taskFormSchema.parse(body);

    // タスクを更新する
    await updateTask(task)
    
    // メッセージを返却する
    return NextResponse.json({});
  } catch (err) {
    return handleServerError(err)
  }
}

/** タスクを削除する */
export async function DELETE(
  request: NextRequest,
) {
  try {
    // bodyからタスクを取得する
    const body: RegisterTaskRequest = await request.json()
    const task = body as TaskFormSchema

    // タスクを削除する
    await deleteTask(task)

    return NextResponse.json({});
  } catch (err) {
    return handleServerError(err)
  }
}

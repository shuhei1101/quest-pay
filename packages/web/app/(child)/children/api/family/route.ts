import { NextRequest, NextResponse } from "next/server";
import { deleteTask } from "../../../_service/deleteTask";
import { handleServerError } from "@/app/(core)/errorHandler";
import { RegisterTaskRequest, RegisterTaskRequestSchema, UpdateTaskRequestSchema } from "../schema";
import { taskDao } from "@/app/(task)/_data-access/taskDao";
import { TaskDeleteSchema } from "@/app/(task)/_schema/taskEntity";


/** タスクを登録する */
export async function POST(
  request: NextRequest,
) {
  try {
    // bodyからタスクを取得する
    const body = await request.json()
    const data  = RegisterTaskRequestSchema.parse(body);

    // タスクを登録する
    await taskDao.insert({
      task: {
        name: data.form.name,
        icon: data.form.icon,
        type: "family"
      },
      tags: data.form.tags
    })

    return NextResponse.json({});
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
    const body = await request.json()
    const data = UpdateTaskRequestSchema.parse(body);

    // タスクを更新する
    await taskDao.update({
      tags: data.form.tags,
      task: {
        icon: data.form.icon,
        type: "family",
        name: data.form.name,
        id: data.task_id,
        updated_at: data.updated_at
      }
    })
    
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
    const body = await request.json()
    const data = TaskDeleteSchema.parse(body);

    // タスクを削除する
    await taskDao.delete(data)

    return NextResponse.json({});
  } catch (err) {
    return handleServerError(err)
  }
}

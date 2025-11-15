import { NextRequest, NextResponse } from "next/server";
import { ProjectFormSchema, projectFormSchema } from "../../_schema/projectSchema";
import { createProject } from "../../_service/createProject";
import { updateProject } from "../../_service/updateProject";
import { deleteProject } from "../../_service/deleteProject";
import { handleServerError } from "@/app/(core)/errorHandler";

export type RegisterProjectRequest = ProjectFormSchema;
export type RegisterProjectResponse = { id: number }
/** プロジェクトを登録する */
export async function POST(
  request: NextRequest,
) {
  try {
    // bodyからプロジェクトを取得する
    const body: RegisterProjectRequest = await request.json()
    const project  = projectFormSchema.parse(body);

    // プロジェクトを登録する
    const id = await createProject(project);

    const response: RegisterProjectResponse = {
      id: id,
    }

    // 作成されたプロジェクトのIDを返却する
    return NextResponse.json(response);
  } catch (err) {
    return handleServerError(err)
  }
}

/** プロジェクトを更新する */
export async function PUT(
  request: NextRequest,
) {
  try {
    // bodyからプロジェクトを取得する
    const body: RegisterProjectRequest = await request.json()
    const project = projectFormSchema.parse(body);

    // プロジェクトを更新する
    await updateProject(project)
    
    // メッセージを返却する
    return NextResponse.json({});
  } catch (err) {
    return handleServerError(err)
  }
}

/** プロジェクトを削除する */
export async function DELETE(
  request: NextRequest,
) {
  try {
    // bodyからプロジェクトを取得する
    const body: RegisterProjectRequest = await request.json()
    const project = body as ProjectFormSchema

    // プロジェクトを削除する
    await deleteProject(project)

    return NextResponse.json({});
  } catch (err) {
    return handleServerError(err)
  }
}

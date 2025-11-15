"use client"

import useSWR from "swr"
import { fetchProject } from "../_query/projectQuery"

/** プロジェクトとメンバーを取得する */
export const useProject = (project_id: number) => {

  if (!project_id) return {
    fetchedProject: undefined,
    fetchedMembers: []
  }

  // プロジェクトIDに紐づくプロジェクトとメンバーを取得する
  const { data: project, error, mutate, isLoading } = useSWR(
    ["プロジェクトメンバー", project_id],
    () => fetchProject(project_id)
  )

  // エラーをチェックする
  if (error) throw error

  if(!project) return {
    fetchedProject: undefined,
    fetchedMembers: []
  }

  const members = Array.isArray(project.project_members) 
    ? project.project_members 
    : [project.project_members];

  return {
    fetchedProject: project,
    fetchedMembers: members.flatMap((m) => m.profiles),
    isLoading,
    refresh :mutate
  }
}

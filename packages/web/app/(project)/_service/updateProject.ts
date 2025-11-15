import { projectDao } from "../_data-access/projectDao";
import { ProjectFormSchema } from "../_schema/projectSchema";

/** プロジェクトを更新する */
export const updateProject = async (project: ProjectFormSchema) => {
  // プロジェクトを更新する
  await projectDao.update({
    id: project.id!,
    name: project.name,
    detail: project.detail,
    is_public: project.is_public!,
    updated_at: project.updated_at!,
    user_ids: project.members.map((member) => member.user_id)
  })
}

import { projectDao } from "../_data-access/projectDao";
import { ProjectFormSchema } from "../_schema/projectSchema";

/** プロジェクトを作成する */
export const createProject = async (project: ProjectFormSchema) => {
  // プロジェクトを挿入する
  const id = await projectDao.insert({
    name: project.name,
    detail: project.detail,
    is_public: project.is_public!,
    user_ids: project.members.map((member) => member.user_id)
  })
  
  return id
}

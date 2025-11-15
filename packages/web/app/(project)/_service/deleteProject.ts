import { projectDao } from "../_data-access/projectDao";
import { ProjectFormSchema } from "../_schema/projectSchema";

/** プロジェクトを削除する */
export const deleteProject = async (project: ProjectFormSchema) => {
  // プロジェクトを削除する
  await projectDao.delete({
    id: project.id!,
    updated_at: project.updated_at!
  })
}

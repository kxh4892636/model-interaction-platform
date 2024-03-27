import { orm } from '@/dao'

export const projectDao = {
  deleteProject: async (projectID: string) => {
    await orm.project.deleteProjectByProjectID(projectID)
    await orm.projectDataset
      .deleteProjectDatasetByProjectID(projectID)
      .catch(() => {
        //
      })
  },
}

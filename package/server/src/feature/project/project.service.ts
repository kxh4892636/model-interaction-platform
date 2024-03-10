import { ProjectType } from '@/type/project.type'
import { projectDao } from './project.dao'

export const projectService = {
  getProjectByProjectID: async (
    projectID: string,
  ): Promise<ProjectType | null> => {
    const projectInfo = await projectDao.getProjectByProjectID(projectID)
    if (!projectInfo) {
      return null
    }
    const datasetList = await projectDao.getDatasetListOfProject(projectID)

    return {
      datasetIDArray: datasetList.map((value) => value.dataset_id),
      projectCoverImage: projectInfo.project_cover_image,
      projectId: projectInfo.project_id,
      projectName: projectInfo.project_name,
      projectPositionZoom: projectInfo.project_position_zoom,
      projectTag: projectInfo.project_tag,
    }
  },
}

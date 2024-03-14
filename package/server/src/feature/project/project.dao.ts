import { prisma } from '@/util/db/prisma'
import { randomUUID } from 'crypto'

export const projectDao = {
  createProject: async (
    coverImage: string,
    projectPath: string,
    projectID: string,
    projectName: string,
    timeStamp: string,
    projectPositionAndZoom: number[],
    projectTags: string[],
  ) => {
    await prisma.project.create({
      data: {
        project_cover_image: coverImage,
        project_folder_path: projectPath,
        project_id: projectID,
        project_name: projectName,
        project_timestamp: timeStamp,
        project_position_zoom: projectPositionAndZoom,
        project_tag: projectTags,
        status: 'active',
        create_time: timeStamp,
        update_time: timeStamp,
      },
    })
  },

  createProjectDataset: async (
    projectID: string,
    datasetID: string,
    timeStamp: string,
  ) => {
    await prisma.project_dataset.create({
      data: {
        project_dataset_id: randomUUID(),
        project_id: projectID,
        dataset_id: datasetID,
        status: 'active',
        create_time: timeStamp,
        update_time: timeStamp,
      },
    })
  },

  getAllProject: async () => {
    const result = await prisma.project.findMany()
    return result
  },

  getProject: async (projectID: string) => {
    const result = await prisma.project.findUnique({
      where: {
        project_id: projectID,
      },
    })
    return result
  },

  getDatasetListOfProject: async (projectID: string) => {
    const result = await prisma.project_dataset.findMany({
      where: {
        project_id: projectID,
      },
      select: {
        dataset_id: true,
      },
    })

    return result.map((value) => value.dataset_id)
  },

  updateProjectName: async (projectID: string, projectName: string) => {
    const timeStamp = Date.now()
    await prisma.project.update({
      where: {
        project_id: projectID,
      },
      data: {
        project_name: projectName,
        update_time: timeStamp.toString(),
      },
    })
  },

  deleteProject: async (projectID: string) => {
    await prisma.project.delete({
      where: {
        project_id: projectID,
      },
    })
  },

  deleteProjectDataset: async (projectID: string) => {
    await prisma.project_dataset.deleteMany({
      where: {
        project_id: projectID,
      },
    })
  },
}

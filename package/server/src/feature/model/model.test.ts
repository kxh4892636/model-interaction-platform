import { prisma } from '@/util/db/prisma'
import { randomUUID } from 'crypto'
import { templateService } from '../template/template.service'
import { modelService } from './model.service'

const clear = async () => {
  await prisma.project.deleteMany({})
  await prisma.dataset.deleteMany({})
  await prisma.data.deleteMany({})
  await prisma.project_dataset.deleteMany({})
  await prisma.dataset_data.deleteMany({})
  await prisma.model.deleteMany({})
}

const water = async () => {
  try {
    clear()
    await templateService.createTemplate(
      'c5a08bb6-5185-4dab-8da4-a041324a6287',
      'test',
    )
    const projectID = await prisma.project.findMany({})
    const dataID = await prisma.data.findMany({})
    await modelService.water(
      'test',
      projectID[0].project_id,
      randomUUID(),
      dataID.map((value) => value.data_id),
      1,
    )
  } catch (error) {
    console.trace(error)
  }

  console.log('water finished')
}

water()

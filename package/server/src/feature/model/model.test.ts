import { prisma } from '@/util/db/prisma'
import { randomUUID } from 'crypto'
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
    //
    modelService.runModel(
      'water',
      'water-test',
      'e3cfa12b-bfe4-4527-9feb-c42ca24bd402',
      randomUUID(),
      '1e7f1742-3dde-4ca3-b70b-070cda600107',
      1,
      null,
    )
  } catch (error) {
    console.trace(error)
  }

  console.log('water finished')
}

const quality = async () => {
  try {
    modelService.runModel(
      'quality',
      'quality-test',
      'e3cfa12b-bfe4-4527-9feb-c42ca24bd402',
      randomUUID(),
      '2c0bd33c-930c-4313-91dc-e3bfbc898f6a',
      1,
      'e26b79b9-0683-42ad-b9dd-01a67c139b83',
    )
  } catch (error) {
    console.trace(error)
  }

  console.log('finished')
}

const sand = async () => {
  try {
    modelService.runModel(
      'sand',
      'sand-test',
      'e3cfa12b-bfe4-4527-9feb-c42ca24bd402',
      randomUUID(),
      '2c0bd33c-930c-4313-91dc-e3bfbc898f6a',
      1,
      'e26b79b9-0683-42ad-b9dd-01a67c139b83',
    )
  } catch (error) {
    console.trace(error)
  }

  console.log('finished')
}

quality()

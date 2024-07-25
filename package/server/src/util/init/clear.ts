import { mkdir, rm } from 'fs/promises'
import { prisma } from '../db/prisma'

await prisma.project.deleteMany({})
await prisma.dataset.deleteMany({})
await prisma.data.deleteMany({})
await prisma.project_dataset.deleteMany({})
await prisma.dataset_data.deleteMany({})
await prisma.model.deleteMany({})

await rm('D:\\project\\fine-grained-simulation\\data\\project', {
  recursive: true,
})
await mkdir('D:\\project\\fine-grained-simulation\\data\\project')

console.log('finish')

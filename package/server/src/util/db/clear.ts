import { prisma } from './prisma'

await prisma.project.deleteMany({})
await prisma.dataset.deleteMany({})
await prisma.data.deleteMany({})
await prisma.project_dataset.deleteMany({})
await prisma.dataset_data.deleteMany({})
await prisma.model.deleteMany({})

console.log('finish')

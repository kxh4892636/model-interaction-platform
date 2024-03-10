import { sanShaWanTemplate } from '@/feature/template/san-sha-wan'
import { prisma } from './prisma'

await prisma.project.deleteMany({})
await prisma.dataset.deleteMany({})
await prisma.data.deleteMany({})
await prisma.project_dataset.deleteMany({})
await prisma.dataset_data.deleteMany({})
await prisma.model.deleteMany({})

await sanShaWanTemplate.createTemplate('test')
console.log('finish')

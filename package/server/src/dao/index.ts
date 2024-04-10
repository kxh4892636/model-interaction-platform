import { dataDao } from './data'
import { datasetDao } from './dataset'
import { datasetDataDao } from './dataset-data'
import { modelDao } from './model'
import { projectDao } from './project'
import { projectDatasetDao } from './project-dataset'

export const orm = {
  data: dataDao,
  datasetData: datasetDataDao,
  dataset: datasetDao,
  model: modelDao,
  projectDataset: projectDatasetDao,
  project: projectDao,
}

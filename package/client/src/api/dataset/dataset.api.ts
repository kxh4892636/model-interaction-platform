import { DataFetchAPIInterface } from '@/type'
import { extendFetch } from '../api.util'
import {
  DatasetActionBodyType,
  DatasetActionResponseType,
  DatasetActionType,
} from './dataset.type'

export const postDatasetActonAPI = async (params: DatasetActionBodyType) => {
  const jsonHeaders = new Headers({
    'Content-Type': 'application/json',
  })
  const response: DataFetchAPIInterface<DatasetActionType> = await extendFetch(
    `/api/v1/dataset/action`,
    {
      method: 'POST',
      body: JSON.stringify(params),
      headers: jsonHeaders,
    },
  )
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw Error()
      }
    })
    .then((result: DatasetActionResponseType) => {
      if (result.status === 'success') {
        return result
      } else {
        throw Error()
      }
    })
    .catch(() => {
      return {
        status: 'error',
        data: null,
        message: '',
      }
    })

  return response
}

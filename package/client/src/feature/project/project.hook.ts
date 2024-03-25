import { useStateStore } from '@/store/stateStore'
import { DataFetchInterface } from '@/type'
import { useEffect, useState } from 'react'
import { ProjectListType, TemplateListType } from './project.type'
import { getProjectListData, getTemplateListData } from './project.util'

export const useProjectListData = () => {
  const [data, setData] = useState<DataFetchInterface<ProjectListType>>({
    status: 'pending',
    data: null,
    error: null,
  })
  const forceUpdateTag = useStateStore((state) => state.forceUpdateTag)

  useEffect(() => {
    getProjectListData()
      .then((value) => {
        setData({
          status: 'success',
          data: value,
          error: null,
        })
      })
      .catch(() => {
        setData({
          status: 'error',
          data: null,
          error: '',
        })
      })
  }, [forceUpdateTag])

  return data
}

export const useTemplateListData = () => {
  const [data, setData] = useState<DataFetchInterface<TemplateListType>>({
    status: 'pending',
    data: null,
    error: null,
  })

  useEffect(() => {
    getTemplateListData()
      .then((value) => {
        setData({
          status: 'success',
          data: value,
          error: null,
        })
      })
      .catch(() => {
        setData({
          status: 'error',
          data: null,
          error: '',
        })
      })
  }, [])

  return data
}

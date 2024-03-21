import { useStateStore } from '@/store/stateStore'
import { DataQueryHookInterface } from '@/type'
import { useEffect, useState } from 'react'
import { getProjectListData, getTemplateListData } from './project.api'
import { ProjectListType, TemplateListType } from './project.type'

export const useProjectListData = () => {
  const [data, setData] = useState<DataQueryHookInterface<ProjectListType>>({
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
  const [data, setData] = useState<DataQueryHookInterface<TemplateListType>>({
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

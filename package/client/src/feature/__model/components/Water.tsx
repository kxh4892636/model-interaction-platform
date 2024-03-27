import { useLayersStore } from '@/store/layerStore'
import { useMetaStore } from '@/store/metaStore'
import { LayerType } from '@/type'
import {
  Button,
  Input,
  InputNumber,
  Progress,
  Select,
  SelectProps,
  message,
} from 'antd'
import { getModelInfo, postWaterAction } from '../api/model.api'
import { useModelsStatus } from '../stores/models_status'

const createSelectOptions = (layers: LayerType[]) => {
  interface optionType {
    label: string
    value: string
  }
  let selectOptions: optionType[] = []
  for (let index = 0; index < layers.length; index++) {
    const layer = layers[index]
    if (layer.input) {
      selectOptions.push({ label: layer.title, value: layer.key })
    }
  }
  return selectOptions
}

export const Water = () => {
  const layers = useLayersStore((state) => state.layers)
  const options: SelectProps['options'] = createSelectOptions(layers.data)
  const modelStatus = useModelsStatus((state) => state.modelStatus)
  const initModelStatus = useModelsStatus((state) => state.initModelStatus)
  const getModelStatus = useModelsStatus((state) => state.getModelStatus)
  const updateModelStatus = useModelsStatus((state) => state.updateModelStatus)
  const projectKey = useMetaStore((state) => state.projectID)
  const currentModelStatus = getModelStatus('water')

  const getPercent = (modelID: string) => {
    const percentInterval = setInterval(async () => {
      // get progress of model
      const modelInfo = await getModelInfo(modelID)
      if (!modelInfo) return
      if (modelInfo.modelStatus === -1) {
        await postWaterAction(modelID, 'stop', null)
      }
      // update progress of model
      updateModelStatus(
        'water',
        'progress',
        (modelInfo.progress * 100).toFixed(2),
      )
      // add result if model is finished
      if (modelInfo.modelStatus === 0) {
        clearInterval(percentInterval)
        initModelStatus('water')
        message.success('模型运行完毕')
        return
      } else;
    }, 5000)
    updateModelStatus('water', 'intervalStore', percentInterval)
  }

  return (
    <div style={{ maxWidth: '30vw' }}>
      <div>
        <>
          <div
            style={{ padding: '10px 12px' }}
            onClick={() => {
              console.log(getModelStatus('water'))
            }}
          >
            模型名称
          </div>
          <Input
            placeholder="请输入项目案例名称"
            allowClear
            disabled={currentModelStatus.isRunning}
            value={currentModelStatus.modelTitle || undefined}
            style={{ margin: '6px 12px', width: '100%' }}
            onChange={(e) => {
              updateModelStatus('water', 'modelTitle', e.target.value)
            }}
          />
        </>
        <>
          <div style={{ padding: '10px 12px' }}>输入数据集</div>
          <Select
            disabled={currentModelStatus.isRunning}
            allowClear
            style={{ margin: '6px 12px', width: '100%' }}
            placeholder="请选择模型参数"
            value={currentModelStatus.datasetIDOfParams}
            onChange={(values) => {
              updateModelStatus('water', 'datasetIDOfParams', values)
              updateModelStatus('water', 'progress', 0)
            }}
            options={options}
          />
        </>
        <>
          <div style={{ padding: '10px 12px' }}>模拟时间 (小时)</div>
          <InputNumber
            defaultValue={undefined}
            step={24}
            style={{ margin: '6px 12px', width: '100%' }}
            value={currentModelStatus.hours}
            onChange={(value) => {
              updateModelStatus('water', 'hours', value)
            }}
          />
        </>
        <>
          <div style={{ padding: '10px 12px' }}>模型运行进度</div>
          <div style={{ border: '0px' }}>
            <div>
              <Progress
                percent={
                  currentModelStatus.progress ? currentModelStatus.progress : 0
                }
                style={{
                  minWidth: '15vw',
                  marginRight: 'auto',
                  marginLeft: '12px',
                }}
              />
            </div>
            <div>
              <Button
                type="primary"
                style={{
                  marginTop: '20px',
                  marginRight: 'auto',
                  marginLeft: '12px',
                }}
                disabled={
                  !(
                    currentModelStatus.datasetIDOfParams &&
                    currentModelStatus.datasetIDOfParams.length &&
                    currentModelStatus.modelTitle &&
                    currentModelStatus.hours
                  )
                }
                onClick={async () => {
                  updateModelStatus(
                    'water',
                    'isRunning',
                    !currentModelStatus.isRunning,
                  )
                  // stop the model
                  if (currentModelStatus.isRunning) {
                    clearInterval(currentModelStatus.intervalStore!)
                    initModelStatus('water')
                    await postWaterAction(
                      currentModelStatus.modelID!,
                      'stop',
                      null,
                    ).then(() => {
                      message.error('模型停止运行', 10)
                    })
                  } // run the model
                  else {
                    const result = await postWaterAction(
                      currentModelStatus.modelID!,
                      'run',
                      {
                        hours: currentModelStatus.hours!,
                        modelName: currentModelStatus.modelTitle!,
                        modelType: 'water',
                        paramsID: currentModelStatus.datasetIDOfParams!,
                        projectID: projectKey!,
                        uvetID: null,
                      },
                    )
                    if (result) {
                      getPercent(result!)
                      updateModelStatus('water', 'modelID', result)
                    } else {
                      initModelStatus('water')
                      message.error('模型参数错误', 10)
                    }
                  }
                }}
                danger={currentModelStatus.isRunning}
              >
                {currentModelStatus.isRunning ? '停止运行' : '开始运行'}
              </Button>
            </div>
          </div>
        </>
      </div>
    </div>
  )
}

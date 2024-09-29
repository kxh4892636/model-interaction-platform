import { useMetaStore } from '@/store/metaStore'
import { WaterModelTypeType } from '@/type'
import EWE from '../model-ewe/Import'
import { EWEresponse, EWEflag } from '@/store/eweStore'

export const ModelSelect = () => {
  const modelType = useMetaStore((state) => state.modelType)
  const EWEresponseD = EWEresponse((state) => state.Data)
  const EWEflagD = EWEflag((state) => state.Data)

  const map: Record<WaterModelTypeType, string> = {
    'water-2d': '水动力2D模型',
    'water-3d': '水动力3D模型',
    'quality-wasp': '水质模型-wasp',
    'quality-phreec': '醋酸2D模型',
    'quality-phreec-3d': '醋酸3D模型',
    sand: '泥沙模型',
    mud: '抛泥模型',
    ewe: '生态模型',
    'water-ewe': '水环境ewe耦合模型',
    spoil: '扩散模型',
  }

  return (
    <div className="flex h-10 items-center border border-slate-300 bg-white px-2">
      <div>模型类型: </div>
      <div className="relative left-4 text-blue-500">{map[modelType!]}</div>
      <EWE data={EWEresponseD} flag={EWEflagD}></EWE>
    </div>
  )
}

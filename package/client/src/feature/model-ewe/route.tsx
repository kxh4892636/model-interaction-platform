import { useModalStore } from '@/store/modalStore'

import AntvG6T from './EcoPath/AtvG6T'
import BasicInput from './EcoPath/BasicInput'
import BasicEstimate from './EcoPath/Basic_Estimate'
import Diet from './EcoPath/Diet'
import FishLanding from './EcoPath/FishLanding'
import FlowDiagram from './EcoPath/FlowDiagram'
import MixedTrophic from './EcoPath/MixedTrophic'
import Mortality from './EcoPath/Mortality'
import StanzeGroupJS from './EcoPath/StanzeGroup'

import EggProduction from './EcoSim/EggProduction'
import FleetPlot from './EcoSim/FleetPlot'
import ForcingFunction from './EcoSim/ForcingFunction'
import GroupPlot from './EcoSim/GroupPlot'
import Measured from './EcoSim/Measured'
import EcoSimResults from './EcoSim/Results'
import RunEcoSimPlot from './EcoSim/RunEcoSimPlot'
import RunEcoSimPlotValidate from './EcoSim/RunEcoSimPlotValidate'
import Timeseries from './EcoSim/Timeseries'

import MapDepth from './EcoSpace/Depth'
import MapFlow from './EcoSpace/Flow'
import MapHabitat from './EcoSpace/Habitat'
import Dispersal from './EcoSpace/Dispersal'
import EcoSpaceResult from './EcoSpace/EcoSpaceResult'
import EcoSpaceGraph from './EcoSpace/EcoSpaceGraph'
import EcoSpaceMaps from './EcoSpace/EcoSpaceMap'
import { CloseOutlined } from '@ant-design/icons'

interface Routes {
  [key: string]: JSX.Element
}

const Container = (props: any) => {
  const closeModal = useModalStore((state) => state.closeModal)
  return (
    <div
      className="relative left-[15vw] top-[10vh] flex h-[80vh] w-[66vw] flex-col
        rounded-xl border border-slate-300 bg-white shadow-lg shadow-slate-300"
    >
      <div
        className="absolute right-4 top-3 text-xl"
        onClick={() => {
          closeModal()
          // forceUpdateLayerTree()
        }}
      >
        <CloseOutlined />
      </div>

      <div
        className="flex h-12 items-center border-0 border-b border-slate-300
          px-4"
      >
        {props.name}
      </div>
      <div
        className="m-4 h-[70vh] rounded-2xl border border-slate-300
          bg-slate-300/5 p-4 shadow-xl"
      >
        {props.children}
      </div>
    </div>
  )
}

const eweroutes: Routes = {
  BasicInput: (
    <Container name="基本输入">
      <BasicInput />
    </Container>
  ),
  Diet: (
    <Container name="食物矩阵">
      <Diet />
    </Container>
  ),
  StanzeGroup: (
    <Container name="多节功能组">
      <StanzeGroupJS />
    </Container>
  ),
  Landing: (
    <Container name="渔业捕捞">
      <FishLanding />
    </Container>
  ),
  EcopathOutput: (
    <Container name="基本参数计算">
      <BasicEstimate />
    </Container>
  ),
  FlowDiagram: (
    <Container name="食物网结构图">
      <FlowDiagram />
    </Container>
  ),
  AntvG6T: (
    <Container name="营养级流动">
      <AntvG6T />
    </Container>
  ),
  Mortality: (
    <Container name="死亡率">
      <Mortality />
    </Container>
  ),
  MixedTrophicImapct: (
    <Container name="混合营养效率">
      <MixedTrophic />
    </Container>
  ),
  Timeseries: (
    <Container name="功能函数">
      <Timeseries />
    </Container>
  ),
  ForcingFunction: (
    <Container name="水质浓度">
      <ForcingFunction />
    </Container>
  ),
  EggProduction: (
    <Container name="产卵函数">
      <EggProduction />
    </Container>
  ),
  Measured: (
    <Container name="实测生物量">
      <Measured />
    </Container>
  ),
  EcoSimResults: (
    <Container name="生物量表格">
      <EcoSimResults />
    </Container>
  ),
  RunEcoSim: (
    <Container name="各功能组生物量图">
      <RunEcoSimPlot />
    </Container>
  ),
  RunEcoSim_validate: (
    <Container name="各功能组验证生物量">
      <RunEcoSimPlotValidate />
    </Container>
  ),
  GroupPlot: (
    <Container name="各功能组参数">
      <GroupPlot />
    </Container>
  ),
  FleetPlot: (
    <Container name="各功能组捕捞量">
      <FleetPlot />
    </Container>
  ),
  EcoSpace_Depth: (
    <Container name="单元水深">
      <MapDepth />
    </Container>
  ),
  EcoSpace_Flow: (
    <Container name="单元流速">
      <MapFlow />
    </Container>
  ),
  EcoSpace_Habitat: (
    <Container name="栖息地类型">
      <MapHabitat />
    </Container>
  ),
  EcoSpace_Dispersal: (
    <Container name="迁移速率">
      <Dispersal />
    </Container>
  ),
  EcoSpace_Result: (
    <Container name="生物量表格">
      <EcoSpaceResult />
    </Container>
  ),
  EcoSpace_Graph: (
    <Container name="生物量时间分布">
      <EcoSpaceGraph />
    </Container>
  ),
  EcoSpace_Map: (
    <Container name="生物量空间分布">
      <EcoSpaceMaps />
    </Container>
  ),
}
export default eweroutes

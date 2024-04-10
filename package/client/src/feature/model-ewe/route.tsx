import { useModalStore } from '@/store/modalStore'

import BasicInput from "./EcoPath/BasicInput"
import StanzeGroupJS from "./EcoPath/StanzeGroup"
import Diet from "./EcoPath/Diet"
import FishLanding from "./EcoPath/FishLanding"
import BasicEstimate from "./EcoPath/Basic_Estimate"
import FlowDiagram from "./EcoPath/FlowDiagram"
import AntvG6T from "./EcoPath/AtvG6T"
import Mortality from "./EcoPath/Mortality"
import MixedTrophic from "./EcoPath/MixedTrophic"

import Timeseries from "./EcoSim/Timeseries"
import ForcingFunction from "./EcoSim/ForcingFunction"
import EggProduction from "./EcoSim/EggProduction"
import Measured from "./EcoSim/Measured"
import EcoSimResults from "./EcoSim/Results"
import RunEcoSimPlot from "./EcoSim/RunEcoSimPlot"
import RunEcoSimPlot_validate from './EcoSim/RunEcoSimPlot_ validate'
import GroupPlot from "./EcoSim/GroupPlot"
import FleetPlot from "./EcoSim/FleetPlot"


import RunEcosSpace from "./EcoSpace/RunEcosSpace"
import EcoSpaceResult from "./EcoSpace/EcoSpaceResult"


interface Routes {
    [key: string]: JSX.Element;
}

const Container = (props:any) => {
    const closeModal = useModalStore((state) => state.closeModal)
    return (
        <div
        className="relative left-[15vw] top-[10vh] flex h-[80vh] w-[66vw] flex-col
          rounded-xl border border-slate-300 bg-white shadow-lg shadow-slate-300"
      >
        <div
          className="absolute right-4 top-3 bg-slate-400"
          onClick={() => {
            closeModal()
            // forceUpdateLayerTree()
          }}
        >
          关闭
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

const eweroutes: Routes =
{
    "BasicInput":<Container name="基本输入"><BasicInput/></Container>,
    'Diet':<Container name="食物矩阵"><Diet/></Container>,
    'StanzeGroup':<Container name="多节功能组"><StanzeGroupJS/></Container>,
    'Landing':<Container name="渔业捕捞"><FishLanding /></Container>,
    'EcopathOutput':<Container name="基本参数计算"><BasicEstimate/></Container>,
    'FlowDiagram':<Container name="食物网结构图"><FlowDiagram/></Container>,
    'AntvG6T':<Container name="营养剂流动"><AntvG6T/></Container>,
    'Mortality':<Container name="死亡率"><Mortality/></Container>,
    'MixedTrophicImapct':<Container name="混合营养效率"><MixedTrophic/></Container>,
    'Timeseries':<Container name="功能函数"><Timeseries/></Container>,
    'ForcingFunction':<Container name="水质浓度"><ForcingFunction/></Container>,
    'EggProduction':<Container name="产卵函数"><EggProduction/></Container>,
    'Measured':<Container name="实测生物量"><Measured/></Container>,
    'EcoSimResults':<Container name="生物量表格"><EcoSimResults/></Container>,
    'RunEcoSim':<Container name="各功能组生物量图"><RunEcoSimPlot/></Container>,
    'RunEcoSim_validate':<Container name="各功能组验证生物量"><RunEcoSimPlot_validate/></Container>,
    'GroupPlot':<Container name="各功能组参数"><GroupPlot/></Container>,
    'FleetPlot':<Container name="各功能组捕捞量"><FleetPlot/></Container>,
    'Run_EcoSpace':<Container><RunEcosSpace/></Container>,
    'EcoSpace_Result':<Container><EcoSpaceResult/></Container>
}
export default eweroutes 



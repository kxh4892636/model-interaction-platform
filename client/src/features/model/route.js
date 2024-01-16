
import { Hydrodynamics } from "./components/hydrodynamics";
import { QualityModelPanel } from "./components/quality";
import { SandModelPanel } from "./components/sand";

import EWEModel from "./components/EWEModel";
import BasicInput from "./components/EcoPath/BasicInput"
import StanzeGroupJS from "./components/EcoPath/StanzeGroup"
import Diet from "./components/EcoPath/Diet"
import DetritusFate from "./components/EcoPath/DetritusFate"
import FishDiscardFate from "./components/EcoPath/FishDiscardFate"
import FishLanding from "./components/EcoPath/FishLanding"
import FishDiscard from "./components/EcoPath/FishDiscard"
import BasicEstimate from "./components/EcoPath/Basic_Estimate"
import FlowDiagram from "./components/EcoPath/FlowDiagram"
import AntvG6T from "./components/EcoPath/AtvG6T"
import Mortality from "./components/EcoPath/Mortality"
import MixedTrophic from "./components/EcoPath/MixedTrophic"

import Timeseries from "./components/EcoSim/Timeseries"
import ForcingFunction from "./components/EcoSim/ForcingFunction"
import EggProduction from "./components/EcoSim/EggProduction"
import EcoSimResults from "./components/EcoSim/Results"
import RunEcoSimPlot from "./components/EcoSim/RunEcoSimPlot"
import GroupPlot from "./components/EcoSim/GroupPlot"
import FleetPlot from "./components/EcoSim/FleetPlot"
import { Navigate } from "react-router-dom"

import RunEcosSpace from "./components/EcoSpace/RunEcosSpace"
import EcoSpaceResult from "./components/EcoSpace/EcoSpaceResult"



const routes = [
    {
      path: "/model/hydrodynamics",
      element: <Hydrodynamics model="hydrodynamics" />,
    },
    {
      path: "/model/quality",
      element: <QualityModelPanel model="quality" />,
    },
    {
      path: "/model/sand",
      element: <SandModelPanel model="sand" />,
    },
    {
        path:'model/EWEModel',
        element:<EWEModel/>
    },
    {
        path:'model/BasicInput',
        element:<BasicInput/>
    },
    {
        path:'model/StanzeGroup',
        element:<StanzeGroupJS/>
    },
    {
        path:'model/Diet',
        element:<Diet/>
    },    
    {
        path:'model/DetritusFate',
        element:<DetritusFate/>
    },
    {
        path:'model/Landing',
        element:<FishLanding />
    },  
    {
        path:'model/Discards',
        element:<FishDiscard/>
    },
    {
        path:'model/DiscardFate',
        element:<FishDiscardFate/>
    },  
    {
        path:'model/EcopathOutput',
        element:<BasicEstimate/>
    },
    {
        path:'model/FlowDiagram',
        element:<FlowDiagram/>
    },
    {
        path:'model/AntvG6T',
        element:<AntvG6T/>
    },
    {
        path:'model/Mortality',
        element:<Mortality/>
    },
    {
        path:'model/MixedTrophicImapct',
        element:<MixedTrophic/>
    },
    {
        path:'model/Timeseries',
        element:<Timeseries/>
    },
    {
        path:'model/ForcingFunction',
        element:<ForcingFunction/>
    },
    {
        path:'model/EggProduction',
        element:<EggProduction/>
    },
    {
        path:'model/EcoSimResults',
        element:<EcoSimResults/>
    },
    {
        path:'model/RunEcoSim',
        element:<RunEcoSimPlot/>
    },
    {
        path:'model/GroupPlot',
        element:<GroupPlot/>
    },
    {
        path:'model/FleetPlot',
        element:<FleetPlot/>
    },
    {
        path:'model/Run_EcoSpace',
        element:<RunEcosSpace/>
    },
    {
        path:'model/EcoSpace_Result',
        element:<EcoSpaceResult/>
    },
    {
        path:'/',
        element:<Navigate to='/Group'/>
    }
]
export default routes 

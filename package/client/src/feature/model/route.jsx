import { Water } from './components/Water'

import AntvG6T from './components/EcoPath/AtvG6T'
import BasicEstimate from './components/EcoPath/Basic_Estimate'
import BasicInput from './components/EcoPath/BasicInput'
import DetritusFate from './components/EcoPath/DetritusFate'
import Diet from './components/EcoPath/Diet'
import FishDiscard from './components/EcoPath/FishDiscard'
import FishDiscardFate from './components/EcoPath/FishDiscardFate'
import FishLanding from './components/EcoPath/FishLanding'
import FlowDiagram from './components/EcoPath/FlowDiagram'
import MixedTrophic from './components/EcoPath/MixedTrophic'
import Mortality from './components/EcoPath/Mortality'
import StanzeGroupJS from './components/EcoPath/StanzeGroup'
import EWEModel from './components/EWEModel'

import EggProduction from './components/EcoSim/EggProduction'
import FleetPlot from './components/EcoSim/FleetPlot'
import ForcingFunction from './components/EcoSim/ForcingFunction'
import GroupPlot from './components/EcoSim/GroupPlot'
import EcoSimResults from './components/EcoSim/Results'
import RunEcoSimPlot from './components/EcoSim/RunEcoSimPlot'
import Timeseries from './components/EcoSim/Timeseries'

import { Navigate } from 'react-router-dom'
import EcoSpaceResult from './components/EcoSpace/EcoSpaceResult'
import RunEcosSpace from './components/EcoSpace/RunEcosSpace'

const routes = [
  {
    path: 'water',
    element: <Water model="water" />,
  },
  //   {
  //     path: '/quality',
  //     element: <QualityModelPanel model="quality" />,
  //   },
  //   {
  //     path: '/sand',
  //     element: <SandModelPanel model="sand" />,
  //   },
  {
    path: 'EWEModel',
    element: <EWEModel />,
  },
  {
    path: 'BasicInput',
    element: <BasicInput />,
  },
  {
    path: 'StanzeGroup',
    element: <StanzeGroupJS />,
  },
  {
    path: 'Diet',
    element: <Diet />,
  },
  {
    path: 'DetritusFate',
    element: <DetritusFate />,
  },
  {
    path: 'Landing',
    element: <FishLanding />,
  },
  {
    path: 'Discards',
    element: <FishDiscard />,
  },
  {
    path: 'DiscardFate',
    element: <FishDiscardFate />,
  },
  {
    path: 'EcopathOutput',
    element: <BasicEstimate />,
  },
  {
    path: 'FlowDiagram',
    element: <FlowDiagram />,
  },
  {
    path: 'AntvG6T',
    element: <AntvG6T />,
  },
  {
    path: 'Mortality',
    element: <Mortality />,
  },
  {
    path: 'MixedTrophicImapct',
    element: <MixedTrophic />,
  },
  {
    path: 'Timeseries',
    element: <Timeseries />,
  },
  {
    path: 'ForcingFunction',
    element: <ForcingFunction />,
  },
  {
    path: 'EggProduction',
    element: <EggProduction />,
  },
  {
    path: 'EcoSimResults',
    element: <EcoSimResults />,
  },
  {
    path: 'RunEcoSim',
    element: <RunEcoSimPlot />,
  },
  {
    path: 'GroupPlot',
    element: <GroupPlot />,
  },
  {
    path: 'FleetPlot',
    element: <FleetPlot />,
  },
  {
    path: 'Run_EcoSpace',
    element: <RunEcosSpace />,
  },
  {
    path: 'EcoSpace_Result',
    element: <EcoSpaceResult />,
  },
  {
    path: '*',
    element: <Navigate to="water" />,
  },
]
export default routes

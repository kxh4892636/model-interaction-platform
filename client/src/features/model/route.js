import Group from "./components/Group";
import Diet from "./components/Diet";
import Detritus from "./components/Detritus";
import FisheryDiscFate from "./components/FisheryDiscFate";
import FisheryLand from "./components/FisheryLand";
import FisheryDiscard from "./components/FisheryDiscard";
import EcopathOutput from "./components/EcopathOutput";
import FlowDiagram from "./components/FlowDiagram";
import EWEModel from "./components/EWEfish";
import EWELog from "./components/EWElog";
import EcoSim from "./components/EcoSim"
import EcoSimPNG from "./components/EcoSimPNG"
import Ecospace1 from "./components/Ecospace1"
import Ecospace2 from "./components/Ecospace2"
import Ecospace3 from "./components/Ecospace3"
import EcopathPNG from "./components/EcopathPNG"
import { Navigate } from "react-router-dom";
import { Hydrodynamics } from "./components/hydrodynamics";
import { QualityModelPanel } from "./components/quality";
import { SandModelPanel } from "./components/sand";

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
    path: "/model/Group",
    element: <Group />,
  },
  {
    path: "/model/Diet",
    element: <Diet />,
  },
  {
    path: "/model/DetritusFate",
    element: <Detritus />,
  },
  {
    path: "/model/Landing",
    element: <FisheryLand />,
  },
  {
    path: "/model/Discards",
    element: <FisheryDiscard />,
  },
  {
    path: "/model/DiscardFate",
    element: <FisheryDiscFate />,
  },
  {
    path: "/model/EcopathOutput",
    element: <EcopathOutput />,
  },
  {
    path: "/model/FlowDiagram",
    element: <FlowDiagram />,
  },
  {
    path: "/model/EWEModel",
    element: <EWEModel />,
  },
  {
    path: "/model/EcoSim",
    element: <EcoSim />,
  },
  {
    path: "/model/EcoSimPNG",
    element: <EcoSimPNG />,
  },
  {
    path: "/model/Ecospace1",
    element: <Ecospace1 />,
  },
  {
    path: "/model/Ecospace2",
    element: <Ecospace2 />,
  },
  {
    path: "/model/Ecospace3",
    element: <Ecospace3 />,
  },
  {
    path: "/model/EcopathPNG",
    element: <EcopathPNG />,
  },
  {
    path: "/model",
    element: <EWELog />,
  },
  {
    path: "/",
    element: <Navigate to="/model/EWElog" />,
  },
];
export default routes;

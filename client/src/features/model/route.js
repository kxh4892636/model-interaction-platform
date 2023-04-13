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
    path: "/model",
    element: <EWELog />,
  },
  {
    path: "/",
    element: <Navigate to="/model/EWElog" />,
  },
];
export default routes;

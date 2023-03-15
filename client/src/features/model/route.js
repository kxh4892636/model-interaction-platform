import Group from "./components/Group"
import Diet from "./components/Diet"
import Detritus from "./components/Detritus"
import FisheryDiscFate from "./components/FisheryDiscFate"
import FisheryLand from "./components/FisheryLand"
import FisheryDiscard from "./components/FisheryDiscard"
import EcopathOutput from "./components/EcopathOutput"
import FlowDiagram from "./components/FlowDiagram"
import Hydrodynamic from "./components/Hydrodynamic"
import EWEfish from "./components/EWEfish"
import { Navigate } from "react-router-dom"

const routes = [
    {
        path:'/model/Hydrodynamic',
        element:<Hydrodynamic/>
    },
    {
        path:'/model/Group',
        element:<Group/>
    },
    {
        path:'/model/Diet',
        element:<Diet/>
    },    
    {
        path:'/model/DetritusFate',
        element:<Detritus/>
    },
    {
        path:'/model/Landing',
        element:<FisheryLand/>
    },  
    {
        path:'/model/Discards',
        element:<FisheryDiscard/>
    },
    {
        path:'/model/DiscardFate',
        element:<FisheryDiscFate/>
    },  
    {
        path:'/model/EcopathOutput',
        element:<EcopathOutput/>
    },
    {
        path:'/model/FlowDiagram',
        element:<FlowDiagram/>
    },
    {
        path:'/model/EWEfish',
        element:<EWEfish/>
    },
    {
        path:'/',
        element:<Navigate to='/model/EWEfish'/>
    }
]
export default routes 

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
import {
  postFleetPlotSwitchAPI,
  postGroupPlotSwitchAPI,
} from '@/api/model/model.api'
import { useMetaStore } from '@/store/metaStore'
import { create } from 'zustand'
const eweFile = create((set, get) => ({
  Data: '',
  setData: (newData) =>
    set((state) => ({
      Data: newData,
    })),
}))
// 控制表格的显隐
const TableFlag = create((set, get) => ({
  Flag: false,
  setFlag: (newData) =>
    set((state) => ({
      Flag: newData,
    })),
}))

// Basic Input中的状态
const Basic = create((set, get) => ({
  BasicData: [],
  setBasicData: (newData) =>
    set((state) => ({
      BasicData: [...newData],
    })),
}))

// StanzeSelect
const StanzeSelect = create((set, get) => ({
  Data: [],
  setData: (newData) =>
    set((state) => ({
      Data: [...newData],
    })),
}))
// StanzeSelectedValue
const StanzeSelectedValue = create((set, get) => ({
  Data: '',
  setData: (newData) =>
    set((state) => ({
      Data: newData,
    })),
}))
// StanzeGroup
const StanzeGroup = create((set, get) => ({
  Data: {},
  setData: (newData) =>
    set((state) => ({
      Data: { ...newData },
    })),
}))

// StanzeTable
const StanzeTable = create((set, get) => ({
  Data: [],
  setData: (newData) =>
    set((state) => ({
      Data: [...newData],
    })),
}))
// StanzePlotOption
const StanzePlotOption = create((set, get) => ({
  Data: {},
  setData: (newData) =>
    set((state) => ({
      Data: { ...newData },
    })),
}))
// Diet Cloumns
const Diet_Cloumns = create((set, get) => ({
  Data: [],
  setData: (newData) =>
    set((state) => ({
      Data: [...newData],
    })),
}))

// Diet Data
const Diet_Data = create((set, get) => ({
  Data: [],
  setData: (newData) =>
    set((state) => ({
      Data: [...newData],
    })),
}))
// DetritusFate
const DetritusFate = create((set, get) => ({
  Data: [],
  setData: (newData) =>
    set((state) => ({
      Data: [...newData],
    })),
}))

// FleetsCloums
const FleetsCloums = create((set, get) => ({
  Data: [],
  setData: (newData) =>
    set((state) => ({
      Data: [...newData],
    })),
}))

// Landings
const Landings = create((set, get) => ({
  Data: [],
  setData: (newData) =>
    set((state) => ({
      Data: [...newData],
    })),
}))

// FishDiscard
const Discard = create((set, get) => ({
  Data: [],
  setData: (newData) =>
    set((state) => ({
      Data: [...newData],
    })),
}))

// DiscardFate
const DiscardFate = create((set, get) => ({
  Data: [],
  setData: (newData) =>
    set((state) => ({
      Data: [...newData],
    })),
}))

// 控制Ecopath result的显隐
const EcopathResultFlag = create((set, get) => ({
  Flag: false,
  setFlag: (newData) =>
    set((state) => ({
      Flag: newData,
    })),
}))
// Basic_Estimate
const Basic_Estimate = create((set, get) => ({
  Data: [],
  setData: (newData) =>
    set((state) => ({
      Data: [...newData],
    })),
}))
// FlowDiagram
const FlowDiagram = create((set, get) => ({
  Data: {},
  setData: (newData) =>
    set((state) => ({
      Data: { ...newData },
    })),
}))
// Antv6画的营养等级图
const Lindman_spine = create((set, get) => ({
  Data: {},
  setData: (newData) => {
    // console.log("my",newData)
    set((state) => ({
      Data: { ...newData },
    }))
  },
}))
// Mortalities
const Mortalities = create((set, get) => ({
  Data: [],
  setData: (newData) => {
    // console.log("my",newData)
    set((state) => ({
      Data: [...newData],
    }))
  },
}))
// PredationMortalities
const PredationMortalities = create((set, get) => ({
  Data: {},
  setData: (newData) => {
    // console.log("my",newData)
    set((state) => ({
      Data: { ...newData },
    }))
  },
}))
// FishingMortalities
const FishingMortalities = create((set, get) => ({
  Data: {},
  setData: (newData) => {
    // console.log("my",newData)
    set((state) => ({
      Data: { ...newData },
    }))
  },
}))

// MixedTrophicData
const MixedTrophicData = create((set, get) => ({
  Data: [],
  setData: (newData) => {
    // console.log("my",newData)
    set((state) => ({
      Data: [...newData],
    }))
  },
}))

// From predators detritus All
const FromEvery = create((set, get) => ({
  Data: [],
  setData: (newData) => {
    // console.log("my",newData)
    set((state) => ({
      Data: [...newData],
    }))
  },
}))

// TimeSeries ForcingFunction Measured 是否可以上传
const UploadFlag = create((set, get) => ({
  Data: true,
  setData: (newData) =>
    set((state) => ({
      Data: newData,
    })),
}))
// TimeSelect
const TimeSelect = create((set, get) => ({
  Data: [],
  setData: (newData) =>
    set((state) => ({
      Data: [...newData],
    })),
}))
// TimeSeries
const TimeSeriesData = create((set, get) => ({
  Data: {},
  setData: (newData) =>
    set((state) => ({
      Data: { ...newData },
    })),
}))
// TimeYearData
const TimeYearData = create((set, get) => ({
  Data: [],
  setData: (newData) =>
    set((state) => ({
      Data: [...newData],
    })),
}))
// TimeSeriesPlot
const TimeSeriesPlot = create((set, get) => ({
  Data: [],
  setData: (newData) =>
    set((state) => ({
      Data: [...newData],
    })),
}))
// TimeSelected
const TimeSelected = create((set, get) => ({
  Data: '',
  setData: (newData) =>
    set((state) => ({
      Data: newData,
    })),
}))
// ForcingFunction
const ForcingFunctionData = create((set, get) => ({
  Data: [],
  setData: (newData) =>
    set((state) => ({
      Data: [...newData],
    })),
}))
// EggProduction
const EggProductionData = create((set, get) => ({
  Data: [],
  setData: (newData) =>
    set((state) => ({
      Data: [...newData],
    })),
}))
// Measured
const MeasuredData = create((set, get) => ({
  Data: [],
  setData: (newData) =>
    set((state) => ({
      Data: [...newData],
    })),
}))
// EcoSimResult Group
const EcoSimResult_Group = create((set, get) => ({
  Data: [],
  setData: (newData) =>
    set((state) => ({
      Data: [...newData],
    })),
}))

// EcoSimResult Fleet
const EcoSimResult_Fleet = create((set, get) => ({
  Data: [],
  setData: (newData) =>
    set((state) => ({
      Data: [...newData],
    })),
}))

// EcoSimResult Indices
const EcoSimResult_Indices = create((set, get) => ({
  Data: [],
  setData: (newData) =>
    set((state) => ({
      Data: [...newData],
    })),
}))
// RunEcoSim Option
const RunEcoSim_Option = create((set, get) => ({
  Data: {},
  setData: (newData) =>
    set((state) => ({
      Data: { ...newData },
    })),
}))
// RunEcoSim Option
const RunEcoSim_validate = create((set, get) => ({
  Data: {},
  setData: (newData) =>
    set((state) => ({
      Data: { ...newData },
    })),
}))

// EcoSim Group Plot
const EcoSimGroup_Plot = create((set, get) => ({
  Data: {},
  setData: (newData) =>
    set((state) => ({
      Data: { ...newData },
    })),
}))
function ListItem(props) {
  const newData = props.data
  const setERGroupOption = EcoSimGroup_Plot((state) => state.setData)
  const setERGroupPred = EcoSimGroup_PlotColorPred((state) => state.setData)
  const setERGroupPrey = EcoSimGroup_PlotColorPrey((state) => state.setData)
  const setERGroupFleet = EcoSimGroup_PlotColorFleet((state) => state.setData)
  const projectID = useMetaStore((state) => state.projectID)
  const ewefile = eweFile((state) => state.Data)
  const test = async (item) => {
    const result = await postGroupPlotSwitchAPI({
      projectID,
      name: ewefile,
      id: item.target.childNodes[1].data,
    })
    setERGroupOption(result.Option)
    setERGroupPred(result.Color.Predatorsranked)
    setERGroupPrey(result.Color.Preyranked)
    setERGroupFleet(result.Color.Fleets)
  }
  const result = Object.keys(newData).map((item) => (
    <li
      key={item + '0'}
      onClick={(item) => test(item)}
      style={{ listStyleType: 'none', cursor: 'pointer' }}
    >
      <span
        style={{
          width: '20px',
          height: '10px',
          background: newData[item],
          display: 'inline-block',
          verticalAlign: 'baseline',
          border: 'solid',
          borderWidth: '1px',
        }}
      ></span>
      {item}
    </li>
  ))
  // console.log(result)
  return result
}
// Ecosim Group Plot Color
const EcoSimGroup_PlotColor = create((set, get) => ({
  Data: <></>,
  setData: (newData) => {
    // newData===<></>这样判断不行，<><>是一个react元素，利用其key属性判断
    if (newData.key === null) {
      return set((state) => ({ Data: <></> }))
    }
    set((state) => ({
      Data: <ListItem data={newData}></ListItem>,
    }))
  },
}))
// Ecosim Group Plot Color Prey
const EcoSimGroup_PlotColorPrey = create((set, get) => ({
  Data: <></>,
  setData: (newData) => {
    // newData===<></>这样判断不行，<><>是一个react元素，利用其key属性判断
    if (newData.key === null) {
      return set((state) => ({ Data: <></> }))
    }
    const result = newData.map((item) => (
      <li key={item.Name + '1'} style={{ listStyleType: 'none' }}>
        <span
          style={{
            width: '20px',
            height: '10px',
            background: item.color,
            display: 'inline-block',
            verticalAlign: 'baseline',
            border: 'solid',
            borderWidth: '1px',
          }}
        ></span>
        {item.Name}
      </li>
    ))
    set((state) => ({
      Data: result,
    }))
  },
}))
// Ecosim Group Plot Color Pred
const EcoSimGroup_PlotColorPred = create((set, get) => ({
  Data: <></>,
  setData: (newData) => {
    // newData===<></>这样判断不行，<><>是一个react元素，利用其key属性判断
    if (newData.key === null) {
      return set((state) => ({ Data: <></> }))
    }
    const result = newData.map((item) => (
      <li key={item.Name + '2'} style={{ listStyleType: 'none' }}>
        <span
          style={{
            width: '20px',
            height: '10px',
            background: item.color,
            display: 'inline-block',
            verticalAlign: 'baseline',
            border: 'solid',
            borderWidth: '1px',
          }}
        ></span>
        {item.Name}
      </li>
    ))
    set((state) => ({
      Data: result,
    }))
  },
}))
// Ecosim Group Plot Color Fleet
const EcoSimGroup_PlotColorFleet = create((set, get) => ({
  Data: <></>,
  setData: (newData) => {
    // newData===<></>这样判断不行，<><>是一个react元素，利用其key属性判断
    if (newData.key === null) {
      return set((state) => ({ Data: <></> }))
    }
    const result = newData.map((item) => (
      <li key={item.Name + '3'} style={{ listStyleType: 'none' }}>
        <span
          style={{
            width: '20px',
            height: '10px',
            background: item.color,
            display: 'inline-block',
            verticalAlign: 'baseline',
            border: 'solid',
            borderWidth: '1px',
          }}
        ></span>
        {item.Name}
      </li>
    ))
    set((state) => ({
      Data: result,
    }))
  },
}))

// EcoSim Fleet Plot
const EcoSimFleet_Plot = create((set, get) => ({
  Data: {},
  setData: (newData) =>
    set((state) => ({
      Data: { ...newData },
    })),
}))
function ListItemF(props) {
  const newData = props.data
  const setERFleetOption = EcoSimFleet_Plot((state) => state.setData)
  const setERFleetGroup = EcoSimFleet_PlotColorGroup((state) => state.setData)
  const projectID = useMetaStore((state) => state.projectID)
  const ewefile = eweFile((state) => state.Data)
  const test = async (item) => {
    const result = await postFleetPlotSwitchAPI({
      projectID,
      name: ewefile,
      id: item.target.childNodes[1].data,
    })
    setERFleetOption(result.Option)
    setERFleetGroup(result.Color)
    // axios({
    //     method: "post",
    //     baseURL: "http://localhost:4000/formal/FleetPlot_Switch",
    //     data: { name: item.target.childNodes[1].data },
    // }).then((response) => {
    //     if (response.status === 200) {
    //         setERFleetOption(response.data.Option)
    //         setERFleetGroup(response.data.Color)
    //     }
    //     else {
    //         console.log("FleetPlot Error")
    //     }
    // });
  }
  const result = Object.keys(newData).map((item) => (
    <li
      key={item + '0'}
      onClick={(item) => test(item)}
      style={{ listStyleType: 'none', cursor: 'pointer' }}
    >
      <span
        style={{
          width: '20px',
          height: '10px',
          background: newData[item],
          display: 'inline-block',
          verticalAlign: 'baseline',
          border: 'solid',
          borderWidth: '1px',
        }}
      ></span>
      {item}
    </li>
  ))
  return result
}
// Ecosim Fleet Plot Color
const EcoSimFleet_PlotColor = create((set, get) => ({
  Data: <></>,
  setData: (newData) => {
    // newData===<></>这样判断不行，<><>是一个react元素，利用其key属性判断
    if (newData.key === null) {
      return set((state) => ({ Data: <></> }))
    }
    set((state) => ({
      Data: <ListItemF data={newData}></ListItemF>,
    }))
  },
}))
// Ecosim Fleet Plot Color Group
const EcoSimFleet_PlotColorGroup = create((set, get) => ({
  Data: <></>,
  setData: (newData) => {
    // newData===<></>这样判断不行，<><>是一个react元素，利用其key属性判断
    if (newData.key === null) {
      return set((state) => ({ Data: <></> }))
    }
    const result = newData.map((item) => (
      <li key={item.Name + '1'} style={{ listStyleType: 'none' }}>
        <span
          style={{
            width: '20px',
            height: '10px',
            background: item.color,
            display: 'inline-block',
            verticalAlign: 'baseline',
            border: 'solid',
            borderWidth: '1px',
          }}
        ></span>
        {item.Name}
      </li>
    ))
    set((state) => ({
      Data: result,
    }))
  },
}))

// EcoSpaceResult Group
const EcoSpaceResult_Group = create((set, get) => ({
  Data: [],
  setData: (newData) =>
    set((state) => ({
      Data: [...newData],
    })),
}))
// EcoSpaceResult Fleet
const EcoSpaceResult_Fleet = create((set, get) => ({
  Data: [],
  setData: (newData) =>
    set((state) => ({
      Data: [...newData],
    })),
}))
// EcoSpaceResult Region
const EcoSpaceResult_Region = create((set, get) => ({
  Data: [],
  setData: (newData) =>
    set((state) => ({
      Data: [...newData],
    })),
}))
// RunEcoSpace Option
const RunEcoSpace_Option = create((set, get) => ({
  Data: {},
  setData: (newData) => {
    // console.log(newData)
    set((state) => ({
      Data: { ...newData },
    }))
  },
}))

// RcoSpace Map
// Depth
const EcoSpaceMap_Depth = create((set, get) => ({
  Data: [[0]],
  setData: (newData) => {
    // console.log("EcoSpaceMap_Depth")
    set((state) => ({
      Data: [...newData],
    }))
  },
}))
const EcoSpaceMap_DepthColor = create((set, get) => ({
  Data: [[0]],
  setData: (newData) => {
    // console.log("EcoSpaceMap_Depth")
    set((state) => ({
      Data: [...newData],
    }))
  },
}))
//Habitat
const EcoSpaceMap_Habitat = create((set, get) => ({
  Data: [[0]],
  setData: (newData) => {
    // console.log("EcoSpaceMap_Depth")
    set((state) => ({
      Data: [...newData],
    }))
  },
}))
const EcoSpaceMap_HabitatLegend = create((set, get) => ({
  Data: {},
  setData: (newData) => {
    // console.log("EcoSpaceMap_Depth")
    set((state) => ({
      Data: { ...newData },
    }))
  },
}))
//Flow
const EcoSpaceMap_Flow = create((set, get) => ({
  Data: [[0]],
  setData: (newData) => {
    // console.log("EcoSpaceMap_Depth")
    set((state) => ({
      Data: [...newData],
    }))
  },
}))
const EcoSpaceMap_FlowColor = create((set, get) => ({
  Data: [[0]],
  setData: (newData) => {
    // console.log(newData)
    set((state) => ({
      Data: [...newData],
    }))
  },
}))
// 迁移速率
const EcoSpaceMap_Dispersal = create((set, get) => ({
  Data: [],
  setData: (newData) => {
    // console.log(newData)
    set((state) => ({
      Data: [...newData],
    }))
  },
}))
// ModelType
const RunEcoSpacae_ModelType = create((set, get) => ({
  Data: 0,
  setData: (newData) =>
    set((state) => ({
      Data: newData,
    })),
}))
// 用于选择群组的SelectOption
const RunEcoSpacae_SelectOption = create((set, get) => ({
  Data: [],
  setData: (newData) =>
    set((state) => ({
      Data: [...newData],
    })),
}))
// 用于选择群组的SelectOption default_value
const RunEcoSpacae_DefaultSelect = create((set, get) => ({
  Data: '',
  setData: (newData) => {
    // console.log(newData)
    set((state) => ({
      Data: newData,
    }))
  },
}))
// Plot Map
const RunEcoSpacae_PlotMap = create((set, get) => ({
  Data: { id: 'none', data: [[0]] },
  setData: (newData) =>
    set((state) => ({
      Data: { ...newData },
    })),
}))

// EcoSpaceTime
const EcoSpaceTime = create((set, get) => ({
  Data: 0,
  setData: (newData) =>
    set((state) => ({
      Data: newData,
    })),
}))
export {
  Basic,
  Basic_Estimate,
  DetritusFate,
  Diet_Cloumns,
  Diet_Data,
  Discard,
  DiscardFate,
  EcoSimFleet_Plot,
  EcoSimFleet_PlotColor,
  EcoSimFleet_PlotColorGroup,
  EcoSimGroup_Plot,
  EcoSimGroup_PlotColor,
  EcoSimGroup_PlotColorFleet,
  EcoSimGroup_PlotColorPred,
  EcoSimGroup_PlotColorPrey,
  EcoSimResult_Fleet,
  EcoSimResult_Group,
  EcoSimResult_Indices,
  EcopathResultFlag,
  EggProductionData,
  FishingMortalities,
  FleetsCloums,
  FlowDiagram,
  ForcingFunctionData,
  FromEvery,
  Landings,
  Lindman_spine,
  MeasuredData,
  MixedTrophicData,
  Mortalities,
  PredationMortalities,
  RunEcoSim_Option,
  RunEcoSim_validate,
  StanzeGroup,
  StanzePlotOption,
  StanzeSelect,
  StanzeSelectedValue,
  StanzeTable,
  TableFlag,
  TimeSelect,
  TimeSelected,
  TimeSeriesData,
  TimeSeriesPlot,
  TimeYearData,
  UploadFlag,
  eweFile,
  EcoSpaceResult_Fleet,
  EcoSpaceResult_Group,
  EcoSpaceResult_Region,
  EcoSpaceMap_Depth,
  EcoSpaceMap_DepthColor,
  EcoSpaceMap_Habitat,
  EcoSpaceMap_HabitatLegend,
  EcoSpaceMap_Flow,
  EcoSpaceMap_FlowColor,
  EcoSpaceMap_Dispersal,
  RunEcoSpacae_ModelType,
  EcoSpaceTime,
  RunEcoSpacae_DefaultSelect,
  RunEcoSpacae_PlotMap,
  RunEcoSpacae_SelectOption,
  RunEcoSpace_Option,
}

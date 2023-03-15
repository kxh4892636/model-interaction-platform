import {create} from "zustand";
// 处理饮食结构的表头
const genDietCol = (modalarray)=>{
    // 将type为 消费者 生产者 
    const modalfordiet = modalarray.filter((element) => element.type===0 || element.type===1 ||element.name==="Detritus" )
    // 拼defaultColumns
    const defaultColumns = []
    defaultColumns.push({title: 'Predator \\ Prey',dataIndex: 'name',key: 'group',fixed: 'left'})
    modalfordiet.map((element) => {
      let tmp = {}
      tmp.title= element.name
      tmp.dataIndex= element.name
      tmp.key = element.name
      tmp.editable=true
      defaultColumns.push(tmp)
      return element
    })
    defaultColumns.push({title: 'Import',dataIndex: 'Import',key: 'Import',editable:true},
                        {title: 'Sum', dataIndex: 'Sum',key: 'Sum',editable:true},
                        {title: '(1-Sum)',dataIndex: '(1-Sum)',key: '(1-Sum)',editable:true})
    return defaultColumns
}
// 处理饮食结构,單純只有每一行的名字。在通过EWE数据库文件加载不需要这一步
const genDiet = (modalarray)=>{
    // 将不是舰队的选出来
    const modalfordiet = modalarray.filter((element) => element.type===0)
    const datasource = []
    modalfordiet.map((element) => {
      let tmp2 = {}
      tmp2.key = element.name
      tmp2.name= element.name
      datasource.push(tmp2)
      return element
    })
    return datasource
}

// 处理Fishery中的Landing表头，在通过EWE数据库文件加载不需要这一步
const genLandCol = (modalarray)=>{
  const defaultColumns = []
  defaultColumns.push({title: 'Group Name',dataIndex: 'name',key: 'group',fixed: 'left'})
  modalarray.map((element) => {
    let tmp = {}
    tmp.title= element.name 
    tmp.dataIndex= element.name
    tmp.key = element.name
    tmp.editable=true
    defaultColumns.push(tmp)
    return element
  })
  defaultColumns.push({title: 'Sum',dataIndex: 'Sum',key: 'Sum'})
  return defaultColumns
}
// 处理Fishery中的Landing数据，單純只有每一行的名字。
const genLand = (modalarray)=>{
  const datasource = []
  modalarray.map((element) => {
    let tmp2 = {}
    tmp2.key = element.name
    tmp2.name= element.name
    datasource.push(tmp2)
    return element
  })
  return datasource
}

// Define Group中的data状态
const useStore = create((set, get) => ({
    GroupData:[
        {
            key: '0',
            name: 'Detritus',
            age: '32',
            address: 'London, Park Lane no. 0',
            stgroup: "stgroup",
            type :1
        },
        ],
    setGroupData: (newData) =>
        set((state) => ({
            GroupData: [...newData]
    })),
}));

// Define Fleet
const FleetModal = create((set, get) => ({
  FleetData:[
      {
          key: '0',
          name: 'Detritus',
          type :3
      },
      ],
  setFleetData: (newData) =>
      set((state) => ({
          FleetData: [...newData]
  })),
}));
// Basic Input中的状态
const Basic = create((set, get) => ({
    GroupTData:[
        {
            key: '0',
            name: 'Detritus',
            age: '32',
            address: 'London, Park Lane no. 0',
            stgroup: "stgroup",
            type :1
        },
        ],
    setGroupTData: (newData) =>
        set((state) => ({
            GroupTData: [...newData]
    })),
}));

// 饮食结构中的data数据
const Diet = create((set, get) => ({
    DietData:[
        {
            key: '0',
            name: 'Detritus',
            age: '32',
            address: 'London, Park Lane no. 0',
            stgroup: "stgroup",
            type :1
        },
        ],
    setDietData: (newData) =>{
        newData = genDiet(newData)
        // console.log(newData)
        set((state) => ({
                DietData: [...newData]
        }))
    },
    // 单纯更新状态
    setDietData2: (newData) =>{
      set((state) => ({
              DietData: [...newData]
      }))
  }
,
}));

// 饮食结构中的Columns数据
const DietCol = create((set, get) => ({
    DietColumns:[
        {
          title: 'Predator \\ Prey',
          dataIndex: 'name',
          key: 'group',
          fixed: 'left',
        },
        {
          title: 'Import', 
          dataIndex: 'Import',
          key: 'Import',
          editable:true
        },
        {
          title: 'Sum', 
          dataIndex: 'Sum',
          key: 'Sum',
          editable:true
        },
        {
          title: '(1-Sum)',
          dataIndex: '(1-Sum)',
          key: '(1-Sum)',
          editable:true
        },
      ],
    setDietColumns: (newData) =>{
        newData = genDietCol(newData)
        // console.log("DietCol",newData)
        set((state) => ({
            DietColumns: [...newData]
    }))},
    // 单纯更新状态
    setDietColumns2: (newData) =>{
      set((state) => ({
        DietColumns: [...newData]
  }))},
}));

// Detritus
const Detritus = create((set, get) => ({
  DetritusData:[
      {
        name: 'Detritus',
        Detritus: 0,
        key: 'Detritus',
        Export:1,
        Sum:1
      },
    ],
  // 单纯更新状态
  setDetritusData: (newData) =>{
    set((state) => ({
      DetritusData: [...newData]
}))},
}));
// FisheryDiscardFate
const FisheryDiscardFate = create((set, get) => ({
  DiscardFateData:[
      {
        name: 'Fleet1',
        Detritus: 1,
        key: 'Fleet1',
        Export:0,
        Sum:1
      },
    ],
  // 单纯更新状态
  setDiscardFateData: (newData) =>{
    set((state) => ({
      DiscardFateData: [...newData]
}))},
}));

// FisheryLand
const FisheryLand = create((set, get) => ({
  LandData:[
      {
        name: 'Detritus',
        key: 'Detritus',
        Total:0,
      },
    ],
  setLandData: (newData) =>{
    newData = genLand(newData)
    // console.log("DietCol",newData)
      set((state) => ({
        LandData: [...newData]
  }))},
  // 单纯更新状态
  setLandData2: (newData) =>{
    set((state) => ({
      LandData: [...newData]
}))},
}));

// FisheryLandCol
const FisheryLandCol = create((set, get) => ({
  LandColumns:[
      {
        title: 'Group Name',
        dataIndex: 'name',
        key: 'group',
        fixed: 'left',
      },
      {
        title: 'Sum', 
        dataIndex: 'Sum',
        key: 'Sum',
        editable:true
      }
    ],
  setLandColumns: (newData) =>{
    newData = genLandCol(newData)
    // console.log("DietCol",newData)
      set((state) => ({
        LandColumns: [...newData]
  }))},
  // 单纯更新状态
  setLandColumns2: (newData) =>{
    set((state) => ({
      LandColumns: [...newData]
}))},
}));

// FisheryDiscard
const FisheryDiscard = create((set, get) => ({
  DiscardData:[
      {
        name: 'Detritus',
        key: 'Detritus',
        Total:0,
      },
    ],
    // 单纯更新状态
  setDiscardData: (newData) =>{
    newData = genLand(newData)
    // console.log("DietCol",newData)
      set((state) => ({
        DiscardData: [...newData]
  }))},
  // 单纯更新状态
  setDiscardData2: (newData) =>{
    set((state) => ({
      DiscardData: [...newData]
}))},
}));

// FisheryDiscardCol
const FisheryDiscardCol = create((set, get) => ({
  DiscardColumns:[
      {
        title: 'Group Name',
        dataIndex: 'name',
        key: 'group',
        fixed: 'left',
      },
      {
        title: 'Sum', 
        dataIndex: 'Sum',
        key: 'Sum',
        editable:true
      }
    ],
  setDiscardColumns: (newData) =>{
    newData = genLandCol(newData)
    // console.log("DiscardColumn",newData)
      set((state) => ({
        DiscardColumns: [...newData]
  }))},
  // 单纯更新状态
  setDiscardColumns2: (newData) =>{
    set((state) => ({
      DiscardColumns: [...newData]
}))},
}));

// Ecopath output
const EcopathOutput = create((set, get) => ({
  EcopathOutputData:[],
  // 单纯更新状态
  setEcopathOutputData: (newData) =>{
    set((state) => ({
      EcopathOutputData: [...newData]
}))},
}));

// Flow Diagram
const FlowDiagram = create((set, get) => ({
  Graph:{},
  // 单纯更新状态
  setGraphData: (newData) =>{
    // console.log("Graph",newData)
    set((state) => ({
      Graph: {...newData}
}))},
}));
export { useStore,Basic,Diet,DietCol,FleetModal,Detritus,FisheryDiscardFate,FisheryLand,FisheryLandCol,FisheryDiscard,FisheryDiscardCol,EcopathOutput,FlowDiagram };
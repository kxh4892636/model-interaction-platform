import React,{useState,useEffect} from 'react'
import { Select,Space,message,Divider,Button,Badge } from 'antd'
import { CheckCircleFilled } from '@ant-design/icons';
import axios from 'axios';
import {
    eweFile,
    Basic,
    StanzeSelect,
    StanzeGroup,
    StanzePlotOption,
    StanzeTable,
    StanzeSelectedValue,
    Diet_Cloumns,
    Diet_Data,TableFlag,
    FleetsCloums,
    Landings,
    Basic_Estimate,
    EcopathResultFlag,
    FlowDiagram,
    Lindman_spine,
    FromEvery,
    Mortalities,
    MixedTrophicData,
    UploadFlag,
    TimeSelect,
    TimeSeriesData,
    TimeYearData,
    TimeSelected,
    TimeSeriesPlot,
    ForcingFunctionData,
    EggProductionData,
    MeasuredData,
    EcoSimResult_Group,
    EcoSimResult_Fleet,
    EcoSimResult_Indices,
    RunEcoSim_Option,
    RunEcoSim_validate,
    EcoSimGroup_Plot,
    EcoSimGroup_PlotColor,
    EcoSimGroup_PlotColorFleet,
    EcoSimGroup_PlotColorPred, 
    EcoSimGroup_PlotColorPrey,
    EcoSimFleet_Plot,
    EcoSimFleet_PlotColor, 
    EcoSimFleet_PlotColorGroup,
    EcoSpaceResult_Group,
    EcoSpaceResult_Fleet,
    EcoSpaceResult_Region,
    RunEcoSpace_Option,
    EcoSpaceMap_Depth,
    RunEcoSpacae_SelectOption,
    RunEcoSpacae_PlotMap,
    RunEcoSpacae_DefaultSelect,
    EcoSpaceTime} from "../../store/eweStore"



const SelectOptions = [
    { value: 'DalianPortnew.eweaccdb', label: 'DalianPortnew.eweaccdb' },
    { value: 'North South of China Sea.eweaccdb', label: 'North South of China Sea.eweaccdb' },
    { value: 'West Scotland.eweaccdb', label: 'West Scotland.eweaccdb' },
    { value: 'Australia North West Shelf.eweaccdb', label: 'Australia North West Shelf.eweaccdb' },
    { value: 'dalianwan.EwEmdb', label: 'dalianwan.EwEmdb' },
  ]

export default function EWE(props) {
    const [ImportFlag,setImportFlag] = useState(false);
    const [EcoPathFlag,setEcoPathFlag] = useState(false);
    const [EcoSimFlag,setEcoSimFlag] = useState(false);
    const [EcoSpaceFlag,setEcoSpaceFlag] = useState(false);

    const FilePath = eweFile((state) => state.Data);
    const setFilePath = eweFile((state) => state.setData);
    const setUPflag = UploadFlag((state) => state.setData);
    //EcoPath
    const setBasicData = Basic((state) => state.setBasicData);
    const setStanzeOption = StanzeSelect((state) => state.setData)
    const setStanzeGroup = StanzeGroup((state) => state.setData)
    const setStanzeTable = StanzeTable((state) => state.setData)
    const setStanzePlotOption = StanzePlotOption((state) => state.setData)
    const setStanzeSelectedValue = StanzeSelectedValue((state) => state.setData)
    const setTableF = TableFlag((state) => state.setFlag);
    const setDietC = Diet_Cloumns((state) => state.setData);
    const setDiet = Diet_Data((state) => state.setData);
    const setFleetC = FleetsCloums((state) => state.setData);
    const setLanding = Landings((state) => state.setData);
    const setMortalitiesData = Mortalities((state) => state.setData);
    const setMixedTrophicData = MixedTrophicData((state) => state.setData);
    //EcoPath涉及的网络分析
    const setBasic_EData = Basic_Estimate((state) => state.setData);
    const setOutTableF = EcopathResultFlag((state) => state.setFlag);
    const setFlowD = FlowDiagram((state) => state.setData);
    const setNetworkData = Lindman_spine((state) => state.setData );
    const setFromEvery = FromEvery((state) => state.setData );
    //EcoSim
    const setTimeOption = TimeSelect((state) => state.setData );
    const setTimeSeries = TimeSeriesData((state) => state.setData );
    const setTimeYearData = TimeYearData((state) => state.setData);
    const setTimeSelected = TimeSelected((state) => state.setData);
    const setTimeSeriesPlot = TimeSeriesPlot((state) => state.setData);
    const setForcingFunctionData = ForcingFunctionData((state) => state.setData);
    const setEggProductionData = EggProductionData((state) => state.setData);
    const setMeasuredData = MeasuredData((state) => state.setData);
    const setERGroup = EcoSimResult_Group((state) => state.setData );
    const setERFleet = EcoSimResult_Fleet((state) => state.setData );
    const setERIndice = EcoSimResult_Indices((state) => state.setData );
    const setEROption = RunEcoSim_Option((state) => state.setData );
    const setERvalidate = RunEcoSim_validate((state) => state.setData );
    const setERGroupOption = EcoSimGroup_Plot((state) => state.setData );
    const setERGroupColor = EcoSimGroup_PlotColor((state) => state.setData );
    const setERGroupPred = EcoSimGroup_PlotColorPred((state) => state.setData );
    const setERGroupPrey = EcoSimGroup_PlotColorPrey((state) => state.setData );
    const setERGroupFleet = EcoSimGroup_PlotColorFleet((state) => state.setData );
    const setERFleetOption = EcoSimFleet_Plot((state) => state.setData );
    const setERFleetColor = EcoSimFleet_PlotColor((state) => state.setData );
    const setERFleetGroup = EcoSimFleet_PlotColorGroup((state) => state.setData );
    //EcoSpace
    const setEcoSpaceResult_Group = EcoSpaceResult_Group((state) => state.setData );
    const setEcoSpaceResult_Fleet = EcoSpaceResult_Fleet((state) => state.setData );
    const setEcoSpaceResult_Region = EcoSpaceResult_Region((state) => state.setData );
    const setEcoSpcae_Option = RunEcoSpace_Option((state) => state.setData );
    const setEcoSpace_Depth = EcoSpaceMap_Depth((state) => state.setData );
    const setEcoSpace_SelectOption = RunEcoSpacae_SelectOption((state) => state.setData );
    const setRunEcoSpace_PlotMap = RunEcoSpacae_PlotMap((state) => state.setData );
    const setRunEcoSpace_DefaultSelect = RunEcoSpacae_DefaultSelect((state) => state.setData );
    const setEcoSpaceTime = EcoSpaceTime((state) => state.setData );

    const RefreshInit = ()=>{
        // EcoPath部分
        setEcoPathFlag(false);
        setStanzeOption([]);
        setStanzeGroup({})
        setStanzeSelectedValue("")
        setStanzeTable([])
        setStanzePlotOption({})

        setBasic_EData([]);
        setFlowD({})
        setNetworkData({})
        setFromEvery([])
        setOutTableF(false);
        setMortalitiesData([]);
        setMixedTrophicData([]);
        setMixedTrophicData([])
        setEcoSpace_Depth([[0]]);

        // EcoSim部分
        setEcoSimFlag(false);
        setTimeOption([])
        setTimeSeries({})
        setTimeYearData([])
        setTimeSelected("")
        setTimeSeriesPlot([])
        setForcingFunctionData([])
        setEggProductionData([])
        setMeasuredData([])
        setERGroup([])
        setERFleet([])
        setERIndice([])
        setEROption({})
        setERGroupOption({})
        setERGroupColor(<></>)
        setERGroupPred(<></>)
        setERGroupPrey(<></>)
        setERGroupFleet(<></>)
        setERFleetOption({})
        setERFleetColor(<></>)
        setERFleetGroup(<></>)

        //EcoSpace部分
        setEcoSpaceFlag(false)
        setEcoSpaceResult_Group([]);
        setEcoSpaceResult_Fleet([]);
        setEcoSpaceResult_Region([]);
        setEcoSpcae_Option({});
        setEcoSpace_SelectOption([])
        setRunEcoSpace_PlotMap({id:"none",data:[[0]]})
        setRunEcoSpace_DefaultSelect("")
    }
    const ImportModel = async (response) => {
        if(Object.keys(response).length !== 0)
        {
            if (response.status === "success") {
                
                //将上一个模型运行结果清楚
                RefreshInit()
                //设置一下文件路径
                // setFilePath(filepath);
                //设置TimeSeries ForcingFunction Measured可以上传
                setUPflag(false)
                //先设置Ecopath运行状态
                setImportFlag(true);
                setStanzeOption(response.EcoPath.StanzeSelect);
                setStanzeGroup(response.EcoPath.StanzeGroup)
                // 有些没有Stanze数组
                if(response.EcoPath.StanzeSelect.length>0){
                    const value = response.EcoPath.StanzeSelect[0].value
                    setStanzeSelectedValue(value)
                    setStanzeTable(response.EcoPath.StanzeGroup[value].LifeStageTable)
                    setStanzePlotOption(response.EcoPath.StanzeGroup[value].option)
                }
                //有些直接没有EcoSim的整个输入
                if(Object.keys(response.EcoSim).length !== 0)
                {
                    setTimeOption(response.EcoSim.TimeSelect)
                    setTimeSeries(response.EcoSim.TimeSeries)
                    setTimeYearData(response.EcoSim.TimeYears)
                    // 有些没有TimeSeries数据
                    if(response.EcoSim.TimeSelect.length>0){
                        const value2 = response.EcoSim.TimeSelect[0].value
                        setTimeSelected(value2)
                        setTimeSeriesPlot(response.EcoSim.TimeSeries[value2])
                    }
                    if(Object.keys(response.EcoSim.ForcingFunction).length !== 0)
                    {
                        setForcingFunctionData(Object.values(response.EcoSim.ForcingFunction)[0].slice(1))
                    }
                    if(Object.keys(response.EcoSim.EggProduction).length !== 0)
                    {
                        setEggProductionData(Object.values(response.EcoSim.EggProduction)[0].slice(1))
                    }
                    
                } 

                setBasicData(response.EcoPath.Basic_Input);
                setDietC(response.EcoPath.DietCloumns);
                setDiet(response.EcoPath.DietComp);
                setFleetC(response.EcoPath.FleetCloumn);
                setLanding(response.EcoPath.Landings);
                setTableF(true);
                setEcoSpace_Depth(response.EcoSpaceDepthData);

                message.destroy(response.message);
                message.success({ content: "数据加载成功！！！", duration: 1.25 });
            } 
            else {
                message.destroy(response.message);
                message.error(`数据加载失败`);
            }
        }
    };
    const RunModel = async (response) => {
        if(Object.keys(response).length !== 0)
        {
            if (response.status === "success") {
                // EcoPath
                setBasic_EData(response.EcoPath.Basic_Estimate);
                setFlowD(response.EcoPath.FlowDiagram)
                setNetworkData(response.EcoPath.LindmanSpine)
                setFromEvery(response.EcoPath.LindmanSpine.fromevery)
                setMortalitiesData(response.EcoPath.Mortality);
                setMixedTrophicData(response.EcoPath.MixedTrophic)
                setOutTableF(true);

                // EcoSim
                setERGroup(response.EcoSim.EcoSim_Result_Group)
                setERFleet(response.EcoSim.EcoSim_Result_Fleet)
                setERIndice(response.EcoSim.EcoSim_Result_Indice)
                setEROption(response.EcoSim.option)
                setERvalidate(response.EcoSim.option_validate)
                setERGroupOption(response.EcoSim.GroupPlot.Option)
                setERGroupColor(response.EcoSim.GroupPlot.GroupColor)
                setERGroupPred(response.EcoSim.GroupPlot.Color.Predatorsranked)
                setERGroupPrey(response.EcoSim.GroupPlot.Color.Preyranked)
                setERGroupFleet(response.EcoSim.GroupPlot.Color.Fleets)
                setERFleetOption(response.EcoSim.FleetPlot.Option)
                setERFleetColor(response.EcoSim.FleetPlot.FleetColor)
                setERFleetGroup(response.EcoSim.FleetPlot.Color)
            }
        }
    }
    const RunEcopath = ()=>{
        if(ImportFlag===true){
            message.loading({ content: "模型计算中", key: "Mloading",duration:0 });
            axios({
                method: "post",
                baseURL: "http://localhost:4000/formal/RunEcoPath",
                data: { filepath: FilePath },
            }).then((response) => {
                if (response.status === 200) {
                    setEcoPathFlag(true);
                    console.log(response.data)
                    setBasic_EData(response.data.Basic_Estimate);
                    setFlowD(response.data.FlowDiagram)
                    setNetworkData(response.data.LindmanSpine)
                    setFromEvery(response.data.LindmanSpine.fromevery)
                    setMortalitiesData(response.data.Mortality);
                    setMixedTrophicData(response.data.MixedTrophic)
                    setOutTableF(true);
                    message.destroy("Mloading");
                    message.success({ content: "模型计算完毕！！！", duration: 1.25 });
                } 
                else {
                    message.destroy("Mloading");
                    message.error(`模型计算出错`);
                }
            });
        }
        else
        {
            message.warning({ content: "请先加载模型", duration: 1.25 })
        }
    }
    const RunEcosim = ()=>{
        if(EcoPathFlag === true)
        {
            message.loading({ content: "模型计算中", key: "Mloading",duration:0 });
            axios({
                method: "post",
                baseURL: "http://localhost:4000/formal/RunEcoSim",
                data: { filepath: FilePath },
            }).then((response) => {
                if (response.status === 200) {
                    setEcoSimFlag(true);
                    console.log(response.data)
                    setERGroup(response.data.EcoSim_Result_Group)
                    setERFleet(response.data.EcoSim_Result_Fleet)
                    setERIndice(response.data.EcoSim_Result_Indice)
                    setEROption(response.data.option)
                    setERGroupOption(response.data.GroupPlot.Option)
                    setERGroupColor(response.data.GroupPlot.GroupColor)
                    setERGroupPred(response.data.GroupPlot.Color.Predatorsranked)
                    setERGroupPrey(response.data.GroupPlot.Color.Preyranked)
                    setERGroupFleet(response.data.GroupPlot.Color.Fleets)
                    setERFleetOption(response.data.FleetPlot.Option)
                    setERFleetColor(response.data.FleetPlot.FleetColor)
                    setERFleetGroup(response.data.FleetPlot.Color)
                    message.destroy("Mloading");
                    message.success({ content: "模型计算完毕！！！", duration: 1.25 });
                } 
                else {
                    message.destroy("Mloading");
                    message.error(`模型计算出错`);
                }
            });
        }
        else
        {
            message.warning({ content: "EcoPath未执行", duration: 1.25 })
        }
    }
    const RunEcospace = ()=>{
        if(EcoPathFlag === true)
        {
            message.loading({ content: "模型计算中", key: "Mloading",duration:0 });
            axios({
                method: "post",
                baseURL: "http://localhost:4000/formal/RunEcoSpace",
                data: { filepath: FilePath },
            }).then((response) => {
                if (response.status === 200) {
                    if(response.data==="NoneEcoSpace")
                    {
                        message.destroy("Mloading");
                        message.error(`没有EcoSpace数据`);
                    }
                    else
                    {
                        setEcoSpaceFlag(true)
                        console.log(response.data)
                        setEcoSpaceResult_Group(response.data.ResultData.EcoSpace_Result_Group);
                        setEcoSpaceResult_Fleet(response.data.ResultData.EcoSpace_Result_Fleet);
                        setEcoSpaceResult_Region(response.data.ResultData.EcoSpace_Result_Region);
                        setEcoSpcae_Option(response.data.option);
                        setEcoSpace_SelectOption(response.data.SelectOption)
                        setRunEcoSpace_PlotMap(response.data.FirstResultMap)
                        setRunEcoSpace_DefaultSelect(response.data.FirstResultMap.id)
                        setEcoSpaceTime(response.data.Time)
                        message.destroy("Mloading");
                        message.success({ content: "模型计算完毕！！！", duration: 1.25 });
                    }
                } 
                else {
                    message.destroy("Mloading");
                    message.error(`模型计算出错`);
                }

            });
        }
        else
        {
            message.warning({ content: "EcoPath未执行", duration: 1.25 })
        }
    }
    // 使用 useEffect hook 在 response 发生变化时设置数据
    useEffect(() => {
        // 检查 response 是否有效
        if (props.flag == "Import") {
            ImportModel(props.data)
        }
        else if(props.flag == "Run")
        {
            RunModel(props.data)
        }
    }, [props]); // 传入 response 作为依赖项，当其变化时执行 effect

    return <></>

}

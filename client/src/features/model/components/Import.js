import React,{useState,useEffect} from 'react'
import { Select,Space,message,Divider,Button,Badge } from 'antd'
import { CheckCircleFilled } from '@ant-design/icons';
import axios from 'axios';
import {
    selectedEWEModelID,
    ImportClick,
    EcoPathClick,
    EcoSimClick,
    EcoSpaceClick,
    Basic,
    StanzeSelect,
    StanzeGroup,
    StanzePlotOption,
    StanzeTable,
    StanzeSelectedValue,
    Diet_Cloumns,
    Diet_Data,TableFlag,
    DetritusFate,
    FleetsCloums,
    Landings,
    Discard,
    DiscardFate,
    Basic_Estimate,
    EcopathResultFlag,
    FlowDiagram,
    Lindman_spine,
    FromEvery,
    Mortalities,
    MixedTrophicData,
    TimeSelect,
    TimeSeriesData,
    TimeYearData,
    TimeSelected,
    TimeSeriesPlot,
    ForcingFunctionData,
    EggProductionData,
    EcoSimResult_Group,
    EcoSimResult_Fleet,
    EcoSimResult_Indices,
    RunEcoSim_Option,
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
    EcoSpaceTime} from "../store"
import { useLayersStore } from "../../../stores/layers_store";
import { serverHost } from "../../../config/global_variable";

// const SelectOptions = [
//     { value: 'DalianPortnew.eweaccdb', label: 'DalianPortnew.eweaccdb' },
//     { value: 'North South of China Sea.eweaccdb', label: 'North South of China Sea.eweaccdb' },
//     { value: 'West Scotland.eweaccdb', label: 'West Scotland.eweaccdb' },
//     { value: 'Australia North West Shelf.eweaccdb', label: 'Australia North West Shelf.eweaccdb' },
//     { value: 'dalianwan.EwEmdb', label: 'dalianwan.EwEmdb' },
//   ]


export default function Import() {

    // 生成select下拉框内容
    const layers = useLayersStore((state) => state.layers);
    const createSelectOptions = (layers) => {
        let selectOptions = [];
        const loop = (data, callback) => {
        for (let index = 0; index < data.length; index++) {
            const layer = data[index];
            if (layer.children) loop(layer.children, callback);
            else;
            if (!layer.group) callback(layer, index, data);
            else;
        }
        };
        loop(layers, (layer) => {
        if (layer.type === "ewemodel") {
            // console.log(layer)
            selectOptions.push({ value: layer.key, label: layer.title,path:layer.path });
        }
        });
        return selectOptions;
    };
    useEffect(() => {
        setSelectOptions(createSelectOptions(layers.data));
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [layers.data.length]);
    const selectEWEModelID = selectedEWEModelID((state) => state.Data);
    const setselectEWEModelID = selectedEWEModelID((state) => state.setEWEModelID);
    const [SelectOptions, setSelectOptions] = useState([]);
    const ImportFlag = ImportClick((state) => state.Flag);
    const setImportFlag = ImportClick((state) => state.setFlag);
    const EcoPathFlag = EcoPathClick((state) => state.Flag);
    const setEcoPathFlag = EcoPathClick((state) => state.setFlag);
    const EcoSimFlag = EcoSimClick((state) => state.Flag);
    const setEcoSimFlag = EcoSimClick((state) => state.setFlag);
    const EcoSpaceFlag = EcoSpaceClick((state) => state.Flag);
    const setEcoSpaceFlag = EcoSpaceClick((state) => state.setFlag);
    const [FilePath,setFilePath] = useState("");

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
    const setDetritusFate = DetritusFate((state) => state.setData);
    const setFleetC = FleetsCloums((state) => state.setData);
    const setLanding = Landings((state) => state.setData);
    const setDiscard = Discard((state) => state.setData);
    const setDiscardFate = DiscardFate((state) => state.setData);
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
    const setERGroup = EcoSimResult_Group((state) => state.setData );
    const setERFleet = EcoSimResult_Fleet((state) => state.setData );
    const setERIndice = EcoSimResult_Indices((state) => state.setData );
    const setEROption = RunEcoSim_Option((state) => state.setData );
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
    const ImportModel = async (filepath) => {
        message.loading({ content: "数据加载中", key: "Mloading",duration:0  });
        axios({
            method: "post",
            baseURL: serverHost + "/api/model/Import",
            data: { filepath: filepath },
        }).then((response) => {
            if (response.status === 200) {
                // console.log(response);
                //将上一个模型运行结果清楚
                RefreshInit()
                //设置一下文件路径
                setFilePath(filepath);
                //先设置Ecopath运行状态
                setImportFlag(true);
                // console.log(response.data);
                setStanzeOption(response.data.EcoPath.StanzeSelect);
                setStanzeGroup(response.data.EcoPath.StanzeGroup)
                // 有些没有Stanze数组
                if(response.data.EcoPath.StanzeSelect.length>0){
                    const value = response.data.EcoPath.StanzeSelect[0].value
                    setStanzeSelectedValue(value)
                    setStanzeTable(response.data.EcoPath.StanzeGroup[value].LifeStageTable)
                    setStanzePlotOption(response.data.EcoPath.StanzeGroup[value].option)
                }
                //有些直接没有EcoSim的整个输入
                if(Object.keys(response.data.EcoSim).length !== 0)
                {
                    setTimeOption(response.data.EcoSim.TimeSelect)
                    setTimeSeries(response.data.EcoSim.TimeSeries)
                    setTimeYearData(response.data.EcoSim.TimeYears)
                    // 有些没有TimeSeries数据
                    if(response.data.EcoSim.TimeSelect.length>0){
                        const value2 = response.data.EcoSim.TimeSelect[0].value
                        setTimeSelected(value2)
                        setTimeSeriesPlot(response.data.EcoSim.TimeSeries[value2])
                    }
                    
                    setForcingFunctionData(Object.values(response.data.EcoSim.ForcingFunction)[0].slice(1))
                    setEggProductionData(Object.values(response.data.EcoSim.EggProduction)[0].slice(1))
                }

                setBasicData(response.data.EcoPath.Basic_Input);
                setDietC(response.data.EcoPath.DietCloumns);
                setDiet(response.data.EcoPath.DietComp);
                setDetritusFate(response.data.EcoPath.DetritusFate);
                setFleetC(response.data.EcoPath.FleetCloumn);
                setLanding(response.data.EcoPath.Landings);
                setDiscard(response.data.EcoPath.Discards);
                setDiscardFate(response.data.EcoPath.DiscardFate);
                setTableF(true);
                setEcoSpace_Depth(response.data.EcoSpaceDepthData);

                message.destroy("Mloading");
                message.success({ content: "数据加载成功！！！", duration: 1.25 });
            } 
            else {
                message.destroy("Mloading");
                message.error(`数据加载失败`);
            }
        });
    };
    const RunEcopath = ()=>{
        if(ImportFlag===true){
            message.loading({ content: "模型计算中", key: "Mloading",duration:0 });
            axios({
                method: "post",
                baseURL:  serverHost + "/api/model/RunEcoPath",
                data: { filepath: FilePath },
            }).then((response) => {
                if (response.status === 200) {
                    setEcoPathFlag(true);
                    // console.log(response.data)
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
                baseURL: serverHost + "/api/model/RunEcoSim",
                data: { filepath: FilePath },
            }).then((response) => {
                // console.log(response.data)
                if (response.status === 200) {
                    setEcoSimFlag(true);
                    // console.log(response.data)
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
                baseURL: serverHost + "/api/model/RunEcoSpace",
                data: { filepath: FilePath },
            }).then((response) => {
                if (response.status === 200) {
                    // console.log(response.data)
                    if(response.data==="NoneEcoSpace")
                    {
                        message.destroy("Mloading");
                        message.error(`没有EcoSpace数据`);
                    }
                    else
                    {
                        setEcoSpaceFlag(true)
                        // console.log(response.data)
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
    return (
        <div>
        <Space>
        <span>模型选择</span>
        <Select
            placeholder="请选择导入的模型"
            value = {selectEWEModelID}
            style={{
            width: 240,
            }}
            onChange={(value,option) => {
                // console.log(option)
                // 先设置UUID 再执行计算
                setselectEWEModelID(option.label);
                ImportModel(option.path);
            }}
            options={SelectOptions}
        />
        <Badge
         count={
            <CheckCircleFilled
              style={{
                // color: '#18CB2A',
                color: EcoPathFlag === false?'#FFA200':'#18CB2A',
              }}
            />}
        >
            <Button style = {{backgroundColor:"#333333",color:"white",display:"block",fontWeight:"bold"}} onClick={RunEcopath}>Run Ecopath</Button>
        </Badge>
        <Badge
         count={
            <CheckCircleFilled
              style={{
                // color: '#18CB2A',
                color: EcoSimFlag === false?'#FFA200':'#18CB2A',
              }}
            />}
        >
        <Button style = {{backgroundColor:"#333333",color:"white",display:"block",fontWeight:"bold"}} onClick={RunEcosim}>Run Ecosim</Button>
        </Badge>
        <Badge
         count={
            <CheckCircleFilled
              style={{
                // color: '#18CB2A',
                color: EcoSpaceFlag === false?'#FFA200':'#18CB2A',
              }}
            />}
        >
        <Button style = {{backgroundColor:"#333333",color:"white",display:"block",fontWeight:"bold"}} onClick={RunEcospace}>Run Ecospace</Button>
        </Badge>
        </Space>
        <Divider></Divider>
    </div>
    )
}

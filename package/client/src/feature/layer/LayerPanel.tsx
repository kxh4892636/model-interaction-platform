import { getProjectTreeAPI } from '@/api/project/project.api'
import { ProjectTreeType } from '@/api/project/project.type'
import { useLayersStore } from '@/store/layerStore'
import { useMetaStore } from '@/store/metaStore'
import { useModalStore } from '@/store/modalStore'
import { LayerType, WaterModelTypeType } from '@/type'
import { message } from 'antd'
import { DataNode } from 'antd/es/tree'
import { useEffect } from 'react'
import { LayerTree } from './LayerTree'
import { LayerTreeMenu } from './LayerTreeMenu'
import { useLayerActions } from './layer.hook'
import { LayerMenuItemType } from './layer.type'

import { DownOutlined } from "@ant-design/icons";
import eweroutes from '../model-ewe/route'
import { Tree } from "antd";

// ewe的树，写死了
const EWEPanel = () => {
  const treeData:DataNode[] = [
        {
          title: "稳态模型",
          key: "0-2-1",
          children: [
            {
              title: "输入",
              key: "0-2-1-1",
              children: [
                {
                  title: "基本参数输入",
                  key: "BasicInput",
                },
                {
                  title: "多节功能组",
                  key: "StanzeGroup",
                },
                {
                  title: "食物矩阵",
                  key: "Diet",
                },
                {
                  title: "渔业捕捞",
                  key: "Landing",
                },
              ],
            },
            {
              title: "输出",
              key: "0-2-1-2",
              children: [
                {
                  title: "基本参数计算",
                  key: "EcopathOutput",
                },
                {
                  title: "食物网结构",
                  key: "FlowDiagram",
                },
                {
                  title: "营养级流动",
                  key: "AntvG6T",
                },
                {
                  title: "死亡率",
                  key: "Mortality",
                },
                {
                  title: "混合营养效率",
                  key: "MixedTrophicImapct",
                },
              ],
            },
          ],
        },
        {
          title: "时间动态模型",
          key: "0-2-2",
          children:[
            {
              title: "输入",
              key: "0-2-2-1",
              children:[
                {
                  title: "功能函数",
                  key: "Timeseries",
                },
                {
                  title: "水质浓度",
                  key: "ForcingFunction",
                },
                {
                  title: "产卵函数",
                  key: "EggProduction",
                },
                {
                  title: "实测生物量",
                  key: "Measured",
                },
              ]
            },
            {
              title: "输出",
              key: "0-2-2-2",
              // icon: <Loading3QuartersOutlined />,
              children: [
                {
                  title: "生物量表格",
                  key: "EcoSimResults",
                },
                {
                  title: "各功能组验证生物量",
                  key: "RunEcoSim_validate",
                },
                {
                  title: "各功能组生物量",
                  key: "RunEcoSim",
                },
                {
                  title: "各功能组参数",
                  key: "GroupPlot",
                },
                {
                  title: "各功能组捕捞量",
                  key: "FleetPlot",
                },
              ],
            }
          ]
          // icon: <AliwangwangOutlined />,

        },
        {
          title: "空间异质模型",
          key: "0-2-3",
          children: [
            // {
            //   title: "Input",
            //   key: "0-5-0",
            //   routekey:"/model/Input",
            //   icon: ({ selected }) => (selected ? <CalendarOutlined /> : <CalendarOutlined />),
            // },
            {
              title: "Run EcoSpace",
              key: "Run_EcoSpace",
            },
            {
              title: "EcoSpace Result",
              key: "EcoSpace_Result",
            },
          ],
        },
  ];
  const openModal = useModalStore((state) => state.openModal)
  return (
    <>
      <Tree
        className="flex-auto overflow-auto p-2"
        showIcon
        // 默认展开指定的树节点
        // defaultExpandedKeys={["0-2-2-1","0-2-2-2-1"]}
        // 默认选中复选框的树节点
        // defaultSelectedKeys={['0-0-0']}
        switcherIcon={<DownOutlined />}
        treeData={treeData}
        onSelect={(_, e) => {
          // 路由切换
          // console.log(eweroutes[e.node.key as string])
          if(eweroutes[e.node.key as string] !== undefined)
          {
            openModal(eweroutes[e.node.key as string])
          }
          
        }}
        style={{ backgroundColor: "#fff", padding: "12px 6px"}}
      />
    </>
  );
};

const filterLayerMenuItems = (
  layer: LayerType,
  layerMenuItems: Record<string, LayerMenuItemType>,
  layerType: string,
): LayerMenuItemType[] => {
  const result: LayerMenuItemType[] = []
  if (layerType === 'data') {
    if (!layer.isGroup) {
      if (layer.layerType === 'text') {
        const temp = layerMenuItems.download
        result.push(temp)
      } else if (layer.layerType === 'ewe') {
        //
      } else {
        const temp = layerMenuItems.map
        result.push(temp)
      }
    }
    const temp = layerMenuItems.delete
    result.push(temp)
  }
  if (layerType === 'map') {
    result.push(layerMenuItems.remove)
  }

  return result
}

const generateAntdTreeData = (
  layers: LayerType[],
  layerMenuItems: Record<string, LayerMenuItemType>,
  layerType: string,
) => {
  const loop = (origin: LayerType[]) => {
    const result: DataNode[] = origin.map((value) => {
      let children: DataNode[] = []
      if (value.children) {
        children = loop(value.children)
      }
      const filterMenuItems = filterLayerMenuItems(
        value,
        layerMenuItems,
        layerType,
      )
      const result = {
        children,
        key: value.layerKey,
        title: (
          <LayerTreeMenu
            title={value.layerName}
            layerMenuItems={filterMenuItems}
          ></LayerTreeMenu>
        ),
      }

      return result
    })

    return result
  }

  const result = loop(layers)

  return result
}

const generateProjectTreeData = async (
  projectID: string | null,
  modelType: WaterModelTypeType,
) => {
  if (!projectID) return null
  const response = await getProjectTreeAPI(projectID)
  if (!response.data) return null

  const loop = (origin: ProjectTreeType) => {
    const result: LayerType[] = origin.map((value) => {
      let children: LayerType[] = []
      if (value.children) {
        children = loop(value.children)
      }
      const result: LayerType = {
        children,
        isGroup: value.isGroup,
        layerKey: value.layerKey,
        layerStyle: value.layerStyle,
        layerName: value.layerName,
        modelType: value.modelType,
        layerType: value.layerType,
      }

      return result
    })

    return result
  }

  const temp: ProjectTreeType = response.data.filter(
    (value) => value.modelType === modelType,
  )
  const result = loop(temp)

  return result
}

const useLayerTreeData = () => {
  const layers = useLayersStore((state) => state.layers)
  const layerTreeTag = useLayersStore((state) => state.layerTreeTag)
  const setLayer = useLayersStore((state) => state.setLayers)
  const projectID = useMetaStore((state) => state.projectID)
  const modelType = useMetaStore((state) => state.modelType)

  useEffect(() => {
    generateProjectTreeData(projectID, modelType)
      .then((value) => {
        setLayer(value || [], 'data')
      })
      .catch(() => {
        setLayer([], 'data')
      })
  }, [projectID, modelType, layerTreeTag])

  return layers
}

export const LayerPanel = () => {
  const modelType = useMetaStore((state) => state.modelType)
  const layers = useLayerTreeData()
  const layerActions = useLayerActions()
  const forceUpdateLayerTree = useLayersStore(
    (state) => state.forceUpdateLayerTree,
  )
  const layerMenuItemsMap = {
    map: {
      key: 'map',
      label: '添加至地图',
      action: () => {
        layerActions.addDataToMap()
      },
    },
    visualization: {
      key: 'visualization',
      label: '可视化',
      action: () => {
        //
      },
    },
    download: {
      key: 'download',
      label: '下载文本文件',
      action: () => {
        layerActions.downloadText()
      },
    },
    delete: {
      key: 'delete',
      label: '删除',
      action: async () => {
        const tag = await layerActions.deleteDataLayer()
        if (tag) {
          forceUpdateLayerTree()
          message.info('删除文件成功', 5)
        } else {
          message.error('删除文件失败', 5)
        }
      },
    },
    remove: {
      key: 'remove',
      label: '移除',
      action: () => {
        layerActions.deleteMapLayer()
      },
    },
  }

  return (
    <div className=" flex h-full flex-col">
      <div className=" flex flex-auto flex-col ">
        <div
          className="mb-0.5 flex max-h-[40vh] flex-1 flex-col border
            border-slate-300 bg-white"
        >
          <div
            className="flex h-10 items-center border-0 border-b
              border-b-slate-300 px-2"
          >
            数据面板
          </div>
          {/*  modelType==="ewe"的话，直接换成我的组件EWEPanel */}
          {modelType==="ewe"?<EWEPanel/>:
            <LayerTree
              type="data"
              treeData={generateAntdTreeData(
                layers.data,
                layerMenuItemsMap,
                'data',
              )}
            ></LayerTree>
          }

        </div>
        <div
          className=" flex flex-1 flex-col border border-b-0 border-slate-300
            bg-white"
        >
          <div
            className="flex h-10 items-center border-0 border-b
              border-b-slate-300 px-2"
          >
            图层面板
          </div>
          <LayerTree
            type="map"
            treeData={generateAntdTreeData(
              layers.map,
              layerMenuItemsMap,
              'map',
            )}
          ></LayerTree>
        </div>
      </div>
    </div>
  )
}

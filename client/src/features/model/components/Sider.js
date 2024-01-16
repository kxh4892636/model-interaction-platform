import {
  DownOutlined,
  CalendarOutlined,
  CreditCardFilled,
  ItalicOutlined,
  Loading3QuartersOutlined,
} from "@ant-design/icons";
import { Tree } from "antd";
import { ImportFlag } from "../store";


const App = (props) => {
  const setImport = ImportFlag((state)=>state.setFlag)
  const treeData = [
    {
      title: "水环境模型",
      key: "water",
      // icon: <AliwangwangOutlined />,
      children: [
        {
          title: "水动力模型",
          key: "hydrodynamics",
          // icon: <AliwangwangOutlined />,
          routekey: "model/hydrodynamics",
          import:false
        },
        {
          title: "水质模型",
          key: "quality",
          // icon: <AliwangwangOutlined />,
          routekey: "model/quality",
          import:false
        },
        {
          title: "泥沙模型",
          key: "sand",
          // icon: <AliwangwangOutlined />,
          routekey: "model/sand",
          import:false
        },
      ],
    },
    {
      title: "生态系统模型",
      key: "0-2",
      // icon: <AliwangwangOutlined />,
      children: [
        {
          title: "模型配置",
          key: "0-0",
          routekey: "model/EWEModel",
          import:true
        },
        {
          title: "Ecopath",
          key: "0-2-1",
          // icon: <RightCircleOutlined />,
          children: [
            {
              title: "输入",
              key: "0-2-1-1",
              icon: <ItalicOutlined />,
              children: [
                {
                  title: "基本参数输入",
                  key: "0-2-1-1-1",
                  routekey: "model/BasicInput",
                  icon: ({ selected }) => (selected ? <CreditCardFilled /> : <CalendarOutlined />),
                  import:true
                },
                {
                  title: "Stanze Group",
                  key: "0-2-1-1-2",
                  routekey: "model/StanzeGroup",
                  icon: ({ selected }) => (selected ? <CreditCardFilled /> : <CalendarOutlined />),
                  import:true
                },
                {
                  title: "食物矩阵",
                  key: "0-2-1-1-3",
                  routekey: "model/Diet",
                  icon: ({ selected }) => (selected ? <CreditCardFilled /> : <CalendarOutlined />),
                  import:true
                },
                {
                  title: "碎屑物去向",
                  key: "0-2-1-1-4",
                  routekey: "model/DetritusFate",
                  icon: ({ selected }) => (selected ? <CreditCardFilled /> : <CalendarOutlined />),
                  import:true
                },
                {
                  title: "渔业",
                  key: "0-2-1-1-5",
                  icon: ({ selected }) => (selected ? <CreditCardFilled /> : <CalendarOutlined />),
                  children: [
                    {
                      title: "捕捞上岸",
                      key: "0-2-1-1-5-1",
                      routekey: "model/Landing",
                      icon: ({ selected }) =>
                        selected ? <CreditCardFilled /> : <CalendarOutlined />,
                        import:true
                    },
                    {
                      title: "捕捞丢弃",
                      key: "0-2-1-1-5-2",
                      routekey: "model/Discards",
                      icon: ({ selected }) =>
                        selected ? <CreditCardFilled /> : <CalendarOutlined />,
                        import:true
                    },
                    {
                      title: "丢弃物去向",
                      key: "0-2-1-1-5-3",
                      routekey: "model/DiscardFate",
                      icon: ({ selected }) =>
                        selected ? <CreditCardFilled /> : <CalendarOutlined />,
                        import:true
                    },
                  ],
                  import:true
                },
              ],
              import:true
            },
            {
              title: "输出",
              key: "0-2-1-2",
              icon: <Loading3QuartersOutlined />,
              children: [
                {
                  title: "基本参数计算",
                  key: "0-2-1-2-1",
                  routekey: "model/EcopathOutput",
                  icon: ({ selected }) => (selected ? <CreditCardFilled /> : <CalendarOutlined />),
                  import:true
                },
                {
                  title: "食物网结构",
                  key: "0-2-1-2-2",
                  routekey: "model/FlowDiagram",
                  icon: ({ selected }) => (selected ? <CreditCardFilled /> : <CalendarOutlined />),
                  import:true
                },
                {
                  title: "营养级流动",
                  key: "0-2-1-2-3",
                  routekey: "model/AntvG6T",
                  icon: ({ selected }) => (selected ? <CreditCardFilled /> : <CalendarOutlined />),
                  import:true
                },
                {
                  title: "Mortality rates",
                  key: "0-2-1-2-4",
                  routekey: "model/Mortality",
                  icon: ({ selected }) => (selected ? <CreditCardFilled /> : <CalendarOutlined />),
                  import:true
                },
                {
                  title: "MixedTrophicImapct",
                  key: "0-2-1-2-5",
                  routekey: "model/MixedTrophicImapct",
                  icon: ({ selected }) => (selected ? <CreditCardFilled /> : <CalendarOutlined />),
                  import:true
                },
              ],
              import:true
            },
          ],
          import:true
        },
        {
          title: "Ecosim",
          key: "0-2-2",
          children:[
            {
              title: "输入",
              key: "0-2-2-1",
              icon: <ItalicOutlined />,
              children:[
                {
                  title: "Timeseries",
                  key: "0-2-2-1-1",
                  routekey:"/model/Timeseries",
                  icon: ({ selected }) => (selected ? <CalendarOutlined /> : <CalendarOutlined />),
                  import:true
                },
                {
                  title: "ForcingFunction",
                  key: "0-2-2-1-2",
                  routekey:"/model/ForcingFunction",
                  icon: ({ selected }) => (selected ? <CalendarOutlined /> : <CalendarOutlined />),
                  import:true
                },
                {
                  title: "EggProduction",
                  key: "0-2-2-1-3",
                  routekey:"/model/EggProduction",
                  icon: ({ selected }) => (selected ? <CalendarOutlined /> : <CalendarOutlined />),
                  import:true
                },
              ],
              import:true
            },
            {
              title: "输出",
              key: "0-2-2-2",
              icon: <Loading3QuartersOutlined />,
              children: [
                {
                  title: "EcoSimResults",
                  key: "0-2-2-2-1",
                  routekey:"/model/EcoSimResults",
                  icon: ({ selected }) => (selected ? <CalendarOutlined /> : <CalendarOutlined />),
                  import:true
                },
                {
                  title: "RunEcoSim",
                  key: "0-2-2-2-2",
                  routekey:"/model/RunEcoSim",
                  icon: ({ selected }) => (selected ? <CalendarOutlined /> : <CalendarOutlined />),
                  import:true
                },
                {
                  title: "EcoSim Group Plot",
                  key: "0-2-2-2-3",
                  routekey:"/model/GroupPlot",
                  icon: ({ selected }) => (selected ? <CalendarOutlined /> : <CalendarOutlined />),
                  import:true
                },
                {
                  title: "EcoSim Fleet Plot",
                  key: "0-2-2-2-5",
                  routekey:"/model/FleetPlot",
                  icon: ({ selected }) => (selected ? <CalendarOutlined /> : <CalendarOutlined />),
                  import:true
                },
              ],
              import:true
            }
          ],
          // icon: <AliwangwangOutlined />,
          import:true
        },
        {
          title: "Ecospace",
          key: "0-2-3",
          // icon: <AliwangwangOutlined />,
          children: [
            {
              title: "Run EcoSpace",
              key: "0-5-1",
              routekey:"/model/Run_EcoSpace",
              icon: ({ selected }) => (selected ? <CalendarOutlined /> : <CalendarOutlined />),
              import:true
            },
            {
              title: "EcoSpace Result",
              key: "0-5-2",
              routekey:"/model/EcoSpace_Result",
              icon: ({ selected }) => (selected ? <CalendarOutlined /> : <CalendarOutlined />),
              import:true
            },
          ],
          import:true
        },
      ],
      import:true
    },
  ];
  return (
    <>
      <Tree
        showIcon
        // 默认展开指定的树节点
        defaultExpandedKeys={["0-2", "water"]}
        // 默认选中复选框的树节点
        // defaultSelectedKeys={['0-0-0']}
        switcherIcon={<DownOutlined />}
        treeData={treeData}
        onSelect={(_, e) => {
          // 路由切换
          props.routechange(e.node.routekey);
          // console.log(e)
          setImport(e.node.import)
        }}
        style={{ backgroundColor: "#fff", padding: "12px 6px" }}
      />
    </>
  );
};
export default App;

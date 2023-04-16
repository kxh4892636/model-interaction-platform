import {
  DownOutlined,
  CalendarOutlined,
  CreditCardFilled,
  ItalicOutlined,
  Loading3QuartersOutlined,
} from "@ant-design/icons";
import { Tree } from "antd";

const App = (props) => {
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
        },
        {
          title: "水质模型",
          key: "quality",
          // icon: <AliwangwangOutlined />,
          routekey: "model/quality",
        },
        {
          title: "泥沙模型",
          key: "sand",
          // icon: <AliwangwangOutlined />,
          routekey: "model/sand",
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
        },
        {
          title: "模型计算",
          key: "2-0-1",
          routekey: "model/EcopathOutput",
          // icon: ({ selected }) => (selected ? <CreditCardFilled /> : <CalendarOutlined />),
        },
        {
          title: "Ecopath",
          key: "0-3",
          // icon: <RightCircleOutlined />,
          children: [
            {
              title: "输入",
              key: "1-0",
              icon: <ItalicOutlined />,
              children: [
                {
                  title: "基本参数输入",
                  key: "0-0-0",
                  routekey: "model/Group",
                  icon: ({ selected }) => (selected ? <CreditCardFilled /> : <CalendarOutlined />),
                },
                {
                  title: "食物矩阵",
                  key: "0-0-1",
                  routekey: "model/Diet",
                  icon: ({ selected }) => (selected ? <CreditCardFilled /> : <CalendarOutlined />),
                },
                {
                  title: "碎屑物去向",
                  key: "0-0-2",
                  routekey: "model/DetritusFate",
                  icon: ({ selected }) => (selected ? <CreditCardFilled /> : <CalendarOutlined />),
                },
                {
                  title: "渔业",
                  key: "0-0-3",
                  icon: ({ selected }) => (selected ? <CreditCardFilled /> : <CalendarOutlined />),
                  children: [
                    {
                      title: "捕捞上岸",
                      key: "0-0-3-0",
                      routekey: "model/Landing",
                      icon: ({ selected }) =>
                        selected ? <CreditCardFilled /> : <CalendarOutlined />,
                    },
                    {
                      title: "捕捞丢弃",
                      key: "0-0-3-1",
                      routekey: "model/Discards",
                      icon: ({ selected }) =>
                        selected ? <CreditCardFilled /> : <CalendarOutlined />,
                    },
                    {
                      title: "丢弃物去向",
                      key: "0-0-3-2",
                      routekey: "model/DiscardFate",
                      icon: ({ selected }) =>
                        selected ? <CreditCardFilled /> : <CalendarOutlined />,
                    },
                  ],
                },
              ],
            },
            {
              title: "输出",
              key: "2-0",
              icon: <Loading3QuartersOutlined />,
              children: [
                {
                  title: "食物网结构",
                  key: "2-0-2",
                  routekey: "model/FlowDiagram",
                  icon: ({ selected }) => (selected ? <CreditCardFilled /> : <CalendarOutlined />),
                },
                {
                  title: "营养级流动",
                  key: "2-0-3",
                  routekey: "model/EcopathPNG",
                  icon: ({ selected }) => (selected ? <CreditCardFilled /> : <CalendarOutlined />),
                },
              ],
            },
          ],
        },
        {
          title: "Ecosim",
          key: "0-4",
          // icon: <AliwangwangOutlined />,
          children: [
            {
              title: "生物量动态变化",
              key: "0-1-0",
              routekey: "/model/EcoSim",
              icon: ({ selected }) => (selected ? <CalendarOutlined /> : <CalendarOutlined />),
            },
            {
              title: "生物量随时间变化",
              key: "0-1-1",
              routekey: "/model/EcoSimPNG",
              icon: ({ selected }) => (selected ? <CalendarOutlined /> : <CalendarOutlined />),
            },
          ],
        },
        {
          title: "Ecospace",
          key: "0-5",
          // icon: <AliwangwangOutlined />,
          children: [
            {
              title: "初级生产能流",
              key: "0-5-0",
              routekey: "/model/Ecospace1",
              icon: ({ selected }) => (selected ? <CalendarOutlined /> : <CalendarOutlined />),
            },
            {
              title: "碎屑的能流",
              key: "0-5-1",
              routekey: "/model/Ecospace2",
              icon: ({ selected }) => (selected ? <CalendarOutlined /> : <CalendarOutlined />),
            },
            {
              title: "综合能流",
              key: "0-5-2",
              routekey: "/model/Ecospace3",
              icon: ({ selected }) => (selected ? <CalendarOutlined /> : <CalendarOutlined />),
            },
          ],
        },
      ],
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
        }}
        style={{ backgroundColor: "#fff", padding: "12px 6px" }}
      />
    </>
  );
};
export default App;

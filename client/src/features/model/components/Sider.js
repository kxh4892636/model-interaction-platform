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
      title: "水动力模型",
      key: "0-1",
      // icon: <AliwangwangOutlined />,
      routekey: "model/hydrodynamics",
    },
    {
      title: "生态系统模型(EWE)",
      key: "0-2",
      routekey: "model/EWElog",
      // icon: <AliwangwangOutlined />,
      children: [
        {
          title: "模型配置",
          key: "0-0",
          routekey: "model/EWEModel",
          icon: ({ selected }) => (selected ? <CreditCardFilled /> : <CalendarOutlined />),
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
                  title: "基本参数计算",
                  key: "2-0-1",
                  routekey: "model/EcopathOutput",
                  icon: ({ selected }) => (selected ? <CreditCardFilled /> : <CalendarOutlined />),
                },
                {
                  title: "食物网",
                  key: "2-0-2",
                  routekey: "model/FlowDiagram",
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
              title: "leaf",
              key: "0-1-0",
              icon: ({ selected }) => (selected ? <CalendarOutlined /> : <CalendarOutlined />),
            },
            {
              title: "leaf",
              key: "0-1-1",
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
        defaultExpandedKeys={["0-0-1", "2-0"]}
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

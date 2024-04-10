import {
  CalendarOutlined,
  CreditCardFilled,
  DownOutlined,
  ItalicOutlined,
  Loading3QuartersOutlined,
} from '@ant-design/icons'
import { Tree } from 'antd'
import { ImportFlag } from '../store'

const App = (props) => {
  const setImport = ImportFlag((state) => state.setFlag)
  const treeData = [
    {
      title: '水环境模型',
      key: '0-1',
      // icon: <AliwangwangOutlined />,
      children: [
        {
          title: '水动力模型',
          key: 'water',
          // icon: <AliwangwangOutlined />,
          routekey: 'water',
          import: false,
        },
        {
          title: '水质模型',
          key: 'quality',
          // icon: <AliwangwangOutlined />,
          routekey: 'quality',
          import: false,
        },
        {
          title: '泥沙模型',
          key: 'sand',
          // icon: <AliwangwangOutlined />,
          routekey: 'sand',
          import: false,
        },
      ],
    },
    {
      title: '生态系统模型',
      key: '0-2',
      // icon: <AliwangwangOutlined />,
      children: [
        {
          title: '模型配置',
          key: '0-0',
          routekey: 'EWEModel',
          import: true,
        },
        {
          title: 'Ecopath',
          key: '0-2-1',
          // icon: <RightCircleOutlined />,
          children: [
            {
              title: '输入',
              key: '0-2-1-1',
              icon: <ItalicOutlined />,
              children: [
                {
                  title: '基本参数输入',
                  key: '0-2-1-1-1',
                  routekey: 'BasicInput',
                  icon: ({ selected }) =>
                    selected ? <CreditCardFilled /> : <CalendarOutlined />,
                  import: true,
                },
                {
                  title: 'Stanze Group',
                  key: '0-2-1-1-2',
                  routekey: 'StanzeGroup',
                  icon: ({ selected }) =>
                    selected ? <CreditCardFilled /> : <CalendarOutlined />,
                  import: true,
                },
                {
                  title: '食物矩阵',
                  key: '0-2-1-1-3',
                  routekey: 'Diet',
                  icon: ({ selected }) =>
                    selected ? <CreditCardFilled /> : <CalendarOutlined />,
                  import: true,
                },
                {
                  title: '碎屑物去向',
                  key: '0-2-1-1-4',
                  routekey: 'DetritusFate',
                  icon: ({ selected }) =>
                    selected ? <CreditCardFilled /> : <CalendarOutlined />,
                  import: true,
                },
                {
                  title: '渔业',
                  key: '0-2-1-1-5',
                  icon: ({ selected }) =>
                    selected ? <CreditCardFilled /> : <CalendarOutlined />,
                  children: [
                    {
                      title: '捕捞上岸',
                      key: '0-2-1-1-5-1',
                      routekey: 'Landing',
                      icon: ({ selected }) =>
                        selected ? <CreditCardFilled /> : <CalendarOutlined />,
                      import: true,
                    },
                    {
                      title: '捕捞丢弃',
                      key: '0-2-1-1-5-2',
                      routekey: 'Discards',
                      icon: ({ selected }) =>
                        selected ? <CreditCardFilled /> : <CalendarOutlined />,
                      import: true,
                    },
                    {
                      title: '丢弃物去向',
                      key: '0-2-1-1-5-3',
                      routekey: 'DiscardFate',
                      icon: ({ selected }) =>
                        selected ? <CreditCardFilled /> : <CalendarOutlined />,
                      import: true,
                    },
                  ],
                  import: true,
                },
              ],
              import: true,
            },
            {
              title: '输出',
              key: '0-2-1-2',
              icon: <Loading3QuartersOutlined />,
              children: [
                {
                  title: '基本参数计算',
                  key: '0-2-1-2-1',
                  routekey: 'EcopathOutput',
                  icon: ({ selected }) =>
                    selected ? <CreditCardFilled /> : <CalendarOutlined />,
                  import: true,
                },
                {
                  title: '食物网结构',
                  key: '0-2-1-2-2',
                  routekey: 'FlowDiagram',
                  icon: ({ selected }) =>
                    selected ? <CreditCardFilled /> : <CalendarOutlined />,
                  import: true,
                },
                {
                  title: '营养级流动',
                  key: '0-2-1-2-3',
                  routekey: 'AntvG6T',
                  icon: ({ selected }) =>
                    selected ? <CreditCardFilled /> : <CalendarOutlined />,
                  import: true,
                },
                {
                  title: 'Mortality rates',
                  key: '0-2-1-2-4',
                  routekey: 'Mortality',
                  icon: ({ selected }) =>
                    selected ? <CreditCardFilled /> : <CalendarOutlined />,
                  import: true,
                },
                {
                  title: 'MixedTrophicImapct',
                  key: '0-2-1-2-5',
                  routekey: 'MixedTrophicImapct',
                  icon: ({ selected }) =>
                    selected ? <CreditCardFilled /> : <CalendarOutlined />,
                  import: true,
                },
              ],
              import: true,
            },
          ],
          import: true,
        },
        {
          title: 'Ecosim',
          key: '0-2-2',
          children: [
            {
              title: '输入',
              key: '0-2-2-1',
              icon: <ItalicOutlined />,
              children: [
                {
                  title: 'Timeseries',
                  key: '0-2-2-1-1',
                  routekey: '/Timeseries',
                  icon: ({ selected }) =>
                    selected ? <CalendarOutlined /> : <CalendarOutlined />,
                  import: true,
                },
                {
                  title: 'ForcingFunction',
                  key: '0-2-2-1-2',
                  routekey: '/ForcingFunction',
                  icon: ({ selected }) =>
                    selected ? <CalendarOutlined /> : <CalendarOutlined />,
                  import: true,
                },
                {
                  title: 'EggProduction',
                  key: '0-2-2-1-3',
                  routekey: '/EggProduction',
                  icon: ({ selected }) =>
                    selected ? <CalendarOutlined /> : <CalendarOutlined />,
                  import: true,
                },
              ],
              import: true,
            },
            {
              title: '输出',
              key: '0-2-2-2',
              icon: <Loading3QuartersOutlined />,
              children: [
                {
                  title: 'EcoSimResults',
                  key: '0-2-2-2-1',
                  routekey: '/EcoSimResults',
                  icon: ({ selected }) =>
                    selected ? <CalendarOutlined /> : <CalendarOutlined />,
                  import: true,
                },
                {
                  title: 'RunEcoSim',
                  key: '0-2-2-2-2',
                  routekey: '/RunEcoSim',
                  icon: ({ selected }) =>
                    selected ? <CalendarOutlined /> : <CalendarOutlined />,
                  import: true,
                },
                {
                  title: 'EcoSim Group Plot',
                  key: '0-2-2-2-3',
                  routekey: '/GroupPlot',
                  icon: ({ selected }) =>
                    selected ? <CalendarOutlined /> : <CalendarOutlined />,
                  import: true,
                },
                {
                  title: 'EcoSim Fleet Plot',
                  key: '0-2-2-2-5',
                  routekey: '/FleetPlot',
                  icon: ({ selected }) =>
                    selected ? <CalendarOutlined /> : <CalendarOutlined />,
                  import: true,
                },
              ],
              import: true,
            },
          ],
          // icon: <AliwangwangOutlined />,
          import: true,
        },
        {
          title: 'Ecospace',
          key: '0-2-3',
          // icon: <AliwangwangOutlined />,
          children: [
            {
              title: 'Run EcoSpace',
              key: '0-5-1',
              routekey: '/Run_EcoSpace',
              icon: ({ selected }) =>
                selected ? <CalendarOutlined /> : <CalendarOutlined />,
              import: true,
            },
            {
              title: 'EcoSpace Result',
              key: '0-5-2',
              routekey: '/EcoSpace_Result',
              icon: ({ selected }) =>
                selected ? <CalendarOutlined /> : <CalendarOutlined />,
              import: true,
            },
          ],
          import: true,
        },
      ],
      import: true,
    },
  ]
  return (
    <>
      <Tree
        showIcon
        // 默认展开指定的树节点
        defaultExpandedKeys={['0-2', 'water']}
        // 默认选中复选框的树节点
        // defaultSelectedKeys={['0-0-0']}
        switcherIcon={<DownOutlined />}
        treeData={treeData}
        onSelect={(_, e) => {
          // 路由切换
          props.routechange(e.node.routekey)
          // console.log(e)
          setImport(e.node.import)
        }}
        style={{ backgroundColor: '#fff', padding: '12px 6px' }}
      />
    </>
  )
}
export default App

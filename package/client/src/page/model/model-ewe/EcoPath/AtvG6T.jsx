import React from 'react'
import G6 from '@antv/g6'
import { useEffect } from 'react'
import { Lindman_spine, FromEvery } from '../../../../store/eweStore'
import { Table, ConfigProvider } from 'antd'
const { Column, ColumnGroup } = Table
const datafont = 10
// node
G6.registerNode(
  'card-node',
  {
    drawShape: function drawShape(cfg, group) {
      const shape = group.addShape('rect', {
        attrs: {
          x: 0,
          y: 10, //立起来的小长条
          width: 100,
          height: 60,
          stroke: 'red',
          radius: 2,
        },
        name: 'main-box',
        draggable: true,
      })
      //立起来的小长条
      group.addShape('rect', {
        attrs: {
          x: 50,
          y: 70,
          width: 1,
          height: 10,
          stroke: 'red',
          radius: 2,
        },
        name: 'top-line',
        draggable: true,
      })
      //立起来的小长条
      group.addShape('rect', {
        attrs: {
          x: 50,
          y: 0,
          width: 1,
          height: 10,
          stroke: 'red',
          radius: 2,
        },
        name: 'bottom-line',
        draggable: true,
      })
      // P D I IV
      group.addShape('text', {
        attrs: {
          y: 55,
          x: 45,
          fontSize: 20,
          margin: 'auto',
          text: cfg.title,
          fill: 'black',
        },
        name: 'title',
      })
      // TST(%)
      group.addShape('text', {
        attrs: {
          textBaseline: 'top',
          y: 14,
          x: 2,
          fontSize: datafont,
          text: cfg.TST,
          fill: 'black',
        },
        name: 'TST',
      })
      // biomass
      group.addShape('text', {
        attrs: {
          textBaseline: 'top',
          y: 60,
          x: 2,
          fontSize: datafont,
          text: cfg.biomass,
          fill: 'black',
        },
        name: 'biomass',
      })
      // respiration
      group.addShape('text', {
        attrs: {
          textBaseline: 'top',
          y: 73,
          x: 53,
          fontSize: datafont,
          text: cfg.respiration,
          fill: 'black',
        },
        name: 'respiration',
      })
      // exports
      group.addShape('text', {
        attrs: {
          textBaseline: 'top',
          y: 0,
          x: 53,
          fontSize: datafont,
          text: cfg.exports,
          fill: 'black',
        },
        name: 'exports',
      })
      return shape
    },
  },
  'single-node',
)
// line 线上下有值 横向
G6.registerEdge('lineTwoText', {
  draw: function draw(cfg, group) {
    const startPoint = cfg.startPoint
    const endPoint = cfg.endPoint
    const keyShape = group.addShape('path', {
      attrs: {
        path: [
          ['M', startPoint.x, startPoint.y],
          ['L', endPoint.x, startPoint.y],
        ],
        // stroke,
        stroke: '#F6BD16',
        lineWidth: 1,
        // startArrow,
        endArrow: {
          path: 'M 0,0 L 12,6 L 9,0 L 12,-6 Z',
          fill: '#F6BD16',
        },
      },
      className: 'edge-shape',
      name: 'edge-shape',
    })
    group.addShape('text', {
      attrs: {
        y: startPoint.y + 12,
        x: startPoint.x + 10,
        // lineHeight: 20,
        fontSize: datafont,
        margin: 'auto',
        text: cfg.TE,
        fill: 'black',
      },
    })
    group.addShape('text', {
      attrs: {
        y: startPoint.y,
        x: startPoint.x + 10,
        // lineHeight: 20,
        fontSize: datafont,
        margin: 'auto',
        text: cfg.predation,
        fill: 'black',
      },
    })
    return keyShape
  },
})
// line 线上下有值 纵向(只用一次)
G6.registerEdge('lineTwoText2', {
  draw: function draw(cfg, group) {
    const startPoint = cfg.startPoint
    const endPoint = cfg.endPoint
    // console.log(startPoint,endPoint)
    const keyShape = group.addShape('path', {
      attrs: {
        path: [
          ['M', startPoint.x, startPoint.y],
          ['L', startPoint.x, endPoint.y],
        ],
        // stroke,
        stroke: '#F6BD16',
        lineWidth: 1,
        // startArrow,
        endArrow: {
          path: 'M 0,0 L 12,6 L 9,0 L 12,-6 Z',
          fill: '#F6BD16',
        },
      },
      className: 'edge-shape',
      name: 'edge-shape',
    })
    group.addShape('text', {
      attrs: {
        y: startPoint.y + (endPoint.y - startPoint.y) / 2,
        x: startPoint.x + 5,
        // lineHeight: 20,
        fontSize: datafont,
        margin: 'auto',
        text: cfg.flowtodet,
        fill: 'black',
      },
    })
    return keyShape
  },
})
// line 拐弯去D
G6.registerEdge('line-arrow', {
  options: {
    style: {
      stroke: '#ccc',
    },
  },
  draw: function draw(cfg, group) {
    const startPoint = cfg.startPoint
    const keyShape = group.addShape('path', {
      attrs: {
        path: [
          ['M', startPoint.x + 100, parseInt(startPoint.y)],
          ['L', startPoint.x + 150, parseInt(startPoint.y)],
          ['L', startPoint.x + 150, 310],
          ['L', 200, 310],
        ],
        // stroke,
        stroke: '#F6BD16',
        lineWidth: 1,
        // startArrow,
        endArrow: {
          path: 'M 0,0 L 12,6 L 9,0 L 12,-6 Z',
          fill: '#F6BD16',
        },
      },
      className: 'edge-shape',
      // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
      name: 'edge-shape',
    })
    group.addShape('text', {
      attrs: {
        y: 310,
        x: startPoint.x + 150,
        // lineHeight: 20,
        fontSize: datafont,
        margin: 'auto',
        text: cfg.flowtodet,
        fill: 'black',
      },
    })
    return keyShape
  },
})

export default function AtvG6T() {
  const NetworkData = Lindman_spine((state) => state.Data)
  const FromEveryData = FromEvery((state) => state.Data)
  let flagnum = 0
  useEffect(() => {
    const container = document.getElementById('container')
    const width = container.scrollWidth
    const height = container.scrollHeight || 500
    flagnum += 1
    // console.log("flagnum  ",flagnum,Object.keys(NetworkData).length>0 && flagnum%2===0)
    if (Object.keys(NetworkData).length > 0 && flagnum % 2 === 0) {
      const graph = new G6.Graph({
        container: 'container',
        width,
        height,
        modes: {
          default: ['drag-canvas', 'drag-node'],
        },
        defaultNode: {
          type: 'card-node',
        },
        // defaultEdge: {
        //   type: 'line-arrow',
        //   /* you can configure the global edge style as following lines */
        //   // style: {
        //   //   stroke: '#F6BD16',
        //   // },
        // },
        fitView: true,
      })
      graph.data(NetworkData)
      graph.render()
    }
  }, [Object.keys(NetworkData).length])
  return (
    <>
      {/* <div id="container" style={{height:"40%",borderBlockStyle:"dotted"}}></div> */}
      <div id="container" style={{ height: '30%' }}></div>
      <ConfigProvider
        theme={{
          token: {
            borderColor: '#fafafa',
          },
        }}
      >
        <Table
          dataSource={FromEveryData}
          size="small"
          bordered="true"
          scroll={{ x: 1500, y: 300 }}
          style={{ height: '400px' }}
        >
          <Column title="TL\Flow" dataIndex="TLFlow" key="TL\Flow" />
          <ColumnGroup title="Import">
            <Column title="From PP" dataIndex="Import_PP" key="From_PP" />
            <Column
              title="From Detritus"
              dataIndex="Import_D"
              key="From Detritus"
            />
            {/* <Column title="From All" dataIndex="Import_All" key="From All" /> */}
          </ColumnGroup>
          <ColumnGroup title="Consumption by predators">
            <Column title="From PP" dataIndex="CP_PP" key="From_PP" />
            <Column
              title="From Detritus"
              dataIndex="CP_D"
              key="From Detritus"
            />
            {/* <Column title="From All" dataIndex="CP_All" key="From All" /> */}
          </ColumnGroup>
          <ColumnGroup title="Export">
            <Column title="From PP" dataIndex="Export_PP" key="From_PP" />
            <Column
              title="From Detritus"
              dataIndex="Export_D"
              key="From Detritus"
            />
            {/* <Column title="From All" dataIndex="Export_All" key="From All" /> */}
          </ColumnGroup>
          <ColumnGroup title="Flow to Detritus">
            <Column title="From PP" dataIndex="FD_PP" key="From_PP" />
            <Column
              title="From Detritus"
              dataIndex="FD_D"
              key="From Detritus"
            />
            {/* <Column title="From All" dataIndex="FD_All" key="From All" /> */}
          </ColumnGroup>
          <ColumnGroup title="Resporation">
            <Column title="From PP" dataIndex="Respiration_PP" key="From_PP" />
            <Column
              title="From Detritus"
              dataIndex="Respiration_D"
              key="From Detritus"
            />
            {/* <Column title="From All" dataIndex="Respiration_All" key="From All" /> */}
          </ColumnGroup>
          <ColumnGroup title="Throughput">
            <Column title="From PP" dataIndex="Throughput_PP" key="From_PP" />
            <Column
              title="From Detritus"
              dataIndex="Throughput_D"
              key="From Detritus"
            />
            {/* <Column title="From All" dataIndex="Throughput_All" key="From All" /> */}
          </ColumnGroup>
        </Table>
      </ConfigProvider>
    </>
  )
}

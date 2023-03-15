import React,{useState} from 'react';
import { Select,List,Button,Form,Progress } from 'antd';
import {DeleteTwoTone,PlayCircleTwoTone} from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
// 图层story
import useLayersStore from "../../../stores/layers_store";
import { useKeys } from "../../../hooks";
const App = () => {
  const layers = useLayersStore((state) => state.layers);
  const getKeys = useKeys();
  const allKeys = getKeys.getLayerKeys(layers);
  console.log("水动力",layers,allKeys)
  const datatemp =  []
  layers.forEach((el)=>{
    datatemp.push({value:el.title,label:el.title,key:el.key,disable:false})
  })
  const [data,setdata] = useState(datatemp.length===0?[{value:"Demo",key:"Demo",label:"Demo",disable:false},{value:"Demo2",key:"Demo2",label:"Demo2",disable:false}]:datatemp)
  // List组件的状态
  const [MyList,setMyList] = useState([]);
  // List 可选数据的List表
  const [MyList2,setMyList2] = useState([]);
  // select框onChange点击事件
  const handleChange = (value,item) => {
    // 将已经选过的数据置为不可选
    const newData = [...data]
    const index = newData.findIndex((iter) => item.key === iter.key);
    const newone = newData[index];
    newone.disabled = true
    newData.splice(index, 1, {
      ...newone,
    });
    // 这里竟然不用setstate就能自动刷新了，估计是因为setMyList，顺带刷了
    setdata(newData)
    setMyList([...MyList,{value:value,key:value}])
  };
  // 可选数据的select的change事件
  const handleChange2 = (value,item) => {
    // 将已经选过的数据置为不可选
    const newData = [...data]
    const index = newData.findIndex((iter) => item.key === iter.key);
    const newone = newData[index];
    newone.disabled = true
    newData.splice(index, 1, {
      ...newone,
    });
    // 这里竟然不用setstate就能自动刷新了，估计是因为setMyList，顺带刷了
    setdata(newData)
    setMyList2([...MyList2,{value:value,key:value}])
  }
  // List组件中的删除
  const handleDelete = (key) => {
    return ()=>{
      // 移除后将恢复至可选
      const newData = [...data]
      const index = newData.findIndex((iter) => key === iter.key);
      const newone = newData[index];
      newone.disabled = false
      newData.splice(index, 1, {
        ...newone,
      });

      const newData2 = MyList.filter((item) => item.key !== key);
      setMyList(newData2);
    }
  };
  // List2组件中的删除
  const handleDelete2 = (key) => {
    return ()=>{
      // 移除后将恢复至可选
      const newData = [...data]
      const index = newData.findIndex((iter) => key === iter.key);
      const newone = newData[index];
      newone.disabled = false
      newData.splice(index, 1, {
        ...newone,
      });

      const newData2 = MyList2.filter((item) => item.key !== key);
      setMyList2(newData2);
    }
  };
  // 进度条状态
  const [percent,setPercent] = useState(0)
  // 运行模型
  const RunModel = ()=>{
    const increase = () => {
      setPercent((prevPercent) => {
        if(prevPercent===100){
          clearInterval(mytime) 
          console.log("结束计时器")
        }
        const newPercent = prevPercent + 10;
        if (newPercent > 100) {
          return 100;
        }
        return newPercent;
      });
    };
    const mytime = setInterval(increase, 500);
  }
  
  return(  
  <>
      <Form labelCol={{ span: 2 }} wrapperCol={{ span: 6 }}>
      <Form.Item label="数据录入">
        <div style={{width:400}}>
              <Select
              placeholder="请选择数据"
              style={{
                width: 200,
              }}
              onChange={handleChange}
              options={data}
            />
          <div
              id="scrollableDiv"
              style={{
                height: 200,
                overflow: 'auto',
                padding: '0 16px',
                border: '1px solid rgba(140, 140, 140, 0.35)',
              }}
            >
            <InfiniteScroll
              dataLength={data.length}
              hasMore={data.length < 50}
              scrollableTarget="scrollableDiv"
            >
            <List
              dataSource={MyList}
              renderItem={(item) => 
                  <List.Item key={item.key} actions={[<Button shape="circle" icon={<DeleteTwoTone />} onClick={handleDelete(item.key)}></Button>]}>
                      {item.value}
                  </List.Item>
                }
            />
            </InfiniteScroll>
          </div>
        </div>
      </Form.Item>
      <Form.Item label="投影">   
          <Select>
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
      </Form.Item>
      <Form.Item label="边界">   
          <Select>
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
      </Form.Item>
      <Form.Item label="可选数据">
        <div style={{width:400}}>
              <Select
              placeholder="请选择数据"
              style={{
                width: 200,
              }}
              onChange={handleChange2}
              options={data}
            />
          <div
              id="scrollableDiv"
              style={{
                height: 200,
                overflow: 'auto',
                padding: '0 16px',
                border: '1px solid rgba(140, 140, 140, 0.35)',
              }}
            >
            <InfiniteScroll
              dataLength={data.length}
              hasMore={data.length < 50}
              scrollableTarget="scrollableDiv"
            >
            <List
              dataSource={MyList2}
              renderItem={(item) => 
                  <List.Item key={item.key} actions={[<Button shape="circle" icon={<DeleteTwoTone />} onClick={handleDelete2(item.key)}></Button>]}>
                      {item.value}
                  </List.Item>
                }
            />
            </InfiniteScroll>
          </div>
        </div>
      </Form.Item>
      <br/>
      <Form.Item label=" " colon={false}>
          <div style={{display:"flex"}}>
              <Button icon={<PlayCircleTwoTone />} onClick={RunModel} style={{marginRight:"16px"}}>运行模型</Button>
              <Progress style={{marginTop:"4px"}} percent={percent} size="small" />
          </div>

      </Form.Item>
    </Form>
  </>
  )
}
  


export default App;

import React, { useState } from "react";
import { Select, List, Button, Form, Progress, message } from "antd";
import { DeleteTwoTone, PlayCircleTwoTone } from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";
// 图层story
import useLayersStore from "../../../stores/layers_store";
// import { useKeys } from "../../../hooks";
import axios from "axios";
import { useData } from "../../../hooks";
// 用来记录边界与投影之前所选的一项，选择另一个后，将之前的设为可选
let TpreIndex = -1;
let BpreIndex = -1;
const App = () => {
  // 处理选择的数据
  const layers = useLayersStore((state) => state.layers);
  const dataActions = useData();
  // const getKeys = useKeys();
  // const allKeys = getKeys.getLayerKeys(layers);
  // console.log("水动力",layers,allKeys)
  const datatemp = [];
  // 生成select组件需要的值 遍历layers
  layers.forEach((el) => {
    // 如果为图层组，则要遍历他的children
    if (el.group === true) {
      el.children.forEach((el) => {
        datatemp.push({ value: el.title, label: el.title, key: el.key, disabled: false });
      });
    } else {
      datatemp.push({ value: el.title, label: el.title, key: el.key, disabled: false });
    }
  });

  // 发往后端用来计算第一个模型的Key数组
  const [CalData, setCalData] = useState([]);
  const [data, setdata] = useState(
    datatemp.length === 0
      ? [
          { value: "Demo", key: "Demo", label: "Demo", disabled: false },
          { value: "Demo2", key: "Demo2", label: "Demo2", disabled: false },
        ]
      : datatemp
  );
  // List组件的状态
  const [MyList, setMyList] = useState([]);
  // List 可选数据的List表
  const [MyList2, setMyList2] = useState([]);
  // Judging the running status of the model
  const [isRunning, setIsRunning] = useState(false);
  // store the keys of uvet
  const [uvetKeys, setUvetKeys] = useState([]);
  // select框onChange点击事件
  const handleChange = (value, item) => {
    // 将已经选过的数据置为不可选
    const newData = [...data];
    const index = newData.findIndex((iter) => item.key === iter.key);
    const newone = newData[index];
    newone.disabled = true;
    newData.splice(index, 1, {
      ...newone,
    });
    // 这里竟然不用setstate就能自动刷新了，估计是因为setMyList，顺带刷了
    setdata(newData);
    setMyList([...MyList, { value: value, key: item.key }]);
    // 更新用于计算的key数组
    setCalData([...CalData, item.key]);
  };
  // 可选数据的select的change事件
  const handleChange2 = (value, item) => {
    // 将已经选过的数据置为不可选
    const newData = [...data];
    const index = newData.findIndex((iter) => item.key === iter.key);
    const newone = newData[index];
    newone.disabled = true;
    newData.splice(index, 1, {
      ...newone,
    });
    // 这里竟然不用setstate就能自动刷新了，估计是因为setMyList，顺带刷了
    setdata(newData);
    setMyList2([...MyList2, { value: value, key: item.key }]);
    // 更新用于计算的key数组
    setCalData([...CalData, item.key]);
  };

  // 边界与投影不与List组件产生关联
  const handleChange3 = (value, item) => {
    // 将已经选过的数据置为不可选
    let newKeys = [...CalData];
    const newData = [...data];
    const index = newData.findIndex((iter) => item.key === iter.key);
    const newone = newData[index];
    newone.disabled = true;
    if (TpreIndex !== -1) {
      newData[TpreIndex].disabled = false;
      newKeys = CalData.filter((item) => item !== newData[TpreIndex].key);
    }
    newData.splice(index, 1, {
      ...newone,
    });

    // 更新用于计算的key数组
    setCalData([...newKeys, item.key]);
    TpreIndex = index;
  };
  // 边界与投影不与List组件产生关联
  const handleChange4 = (value, item) => {
    // 将已经选过的数据置为不可选
    let newKeys = [...CalData];
    const newData = [...data];
    const index = newData.findIndex((iter) => item.key === iter.key);
    const newone = newData[index];
    newone.disabled = true;
    if (BpreIndex !== -1) {
      newData[BpreIndex].disabled = false;
      newKeys = CalData.filter((item) => item !== newData[BpreIndex].key);
    }
    newData.splice(index, 1, {
      ...newone,
    });

    // 更新用于计算的key数组
    setCalData([...newKeys, item.key]);
    BpreIndex = index;
  };
  // List组件中的删除
  const handleDelete = (key) => {
    return () => {
      // 移除后将恢复至可选
      const newData = [...data];
      const index = newData.findIndex((iter) => key === iter.key);
      const newone = newData[index];
      newone.disabled = false;
      newData.splice(index, 1, {
        ...newone,
      });

      const newData2 = MyList.filter((item) => item.key !== key);
      setMyList(newData2);
      setCalData(CalData.filter((item) => item !== key));
    };
  };
  // List2组件中的删除
  const handleDelete2 = (key) => {
    return () => {
      // 移除后将恢复至可选
      const newData = [...data];
      const index = newData.findIndex((iter) => key === iter.key);
      const newone = newData[index];
      newone.disabled = false;
      newData.splice(index, 1, {
        ...newone,
      });

      const newData2 = MyList2.filter((item) => item.key !== key);
      setMyList2(newData2);
      setCalData(CalData.filter((item) => item !== key));
    };
  };
  // 进度条状态
  const [percent, setPercent] = useState(0);
  const [intervalStore, setIntervalStore] = useState();
  // 运行模型
  const RunModel = () => {
    const getPercent = (keys) => {
      intervalStore && clearInterval(intervalStore);
      const percentInterval = setInterval(async () => {
        const dataInfo = await dataActions.getDataDetail(keys[0]);
        const progress = dataInfo.progress;
        console.log(progress);
        setPercent(((progress[0] / progress[1]) * 100).toFixed(2));
        if (progress[0] === progress[1] / 2 && progress[1]) {
          message.success("模型计算完毕, 开始进行模型可视化处理", 10);
        } else if (progress[0] === progress[1] && progress[1]) {
          clearInterval(percentInterval);
          setIsRunning(false);
          keys.forEach((key) => {
            dataActions.addDataToLayerTree(key);
            dataActions.addDataToMap(key);
          });
          message.success("模型运行完毕", 10);
        }
      }, 2000);
      setIntervalStore(percentInterval);
    };
    if (isRunning) {
      getPercent(uvetKeys[0]);
    } else {
      axios({
        method: "post",
        baseURL: "http://localhost:3456/model/Hydrodynamic",
        data: CalData,
      }).then((response) => {
        if (response.data.status === "success") {
          setUvetKeys(response.data.content);
          setIsRunning(true);
          getPercent(response.data.content);
          message.success("模型开始运行", 10);
        } else {
          message.error("模型输入参数错误", 10);
        }
      });
    }
  };

  return (
    <>
      <Form labelCol={{ span: 2 }} wrapperCol={{ span: 6 }}>
        <Form.Item label="数据录入">
          <div style={{ width: 400 }}>
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
                overflow: "auto",
                padding: "0 16px",
                border: "1px solid rgba(140, 140, 140, 0.35)",
              }}
            >
              <InfiniteScroll
                dataLength={data.length}
                hasMore={data.length < 50}
                scrollableTarget="scrollableDiv"
              >
                <List
                  dataSource={MyList}
                  renderItem={(item) => (
                    <List.Item
                      key={item.key}
                      actions={[
                        <Button
                          shape="circle"
                          icon={<DeleteTwoTone />}
                          onClick={handleDelete(item.key)}
                        ></Button>,
                      ]}
                    >
                      {item.value}
                    </List.Item>
                  )}
                />
              </InfiniteScroll>
            </div>
          </div>
        </Form.Item>
        <Form.Item label="投影">
          <Select
            // mode="multiple"
            placeholder="请选择数据"
            style={{
              width: 200,
            }}
            onChange={handleChange3}
            options={data}
          />
        </Form.Item>
        <Form.Item label="边界">
          <Select
            // mode="multiple"
            placeholder="请选择数据"
            style={{
              width: 200,
            }}
            onChange={handleChange4}
            options={data}
          />
        </Form.Item>
        <Form.Item label="可选数据">
          <div style={{ width: 400 }}>
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
                overflow: "auto",
                padding: "0 16px",
                border: "1px solid rgba(140, 140, 140, 0.35)",
              }}
            >
              <InfiniteScroll
                dataLength={data.length}
                hasMore={data.length < 50}
                scrollableTarget="scrollableDiv"
              >
                <List
                  dataSource={MyList2}
                  renderItem={(item) => (
                    <List.Item
                      key={item.key}
                      actions={[
                        <Button
                          shape="circle"
                          icon={<DeleteTwoTone />}
                          onClick={handleDelete2(item.key)}
                        ></Button>,
                      ]}
                    >
                      {item.value}
                    </List.Item>
                  )}
                />
              </InfiniteScroll>
            </div>
          </div>
        </Form.Item>
        <br />
        <Form.Item label=" " colon={false}>
          <div style={{ display: "flex" }}>
            <Button icon={<PlayCircleTwoTone />} onClick={RunModel} style={{ marginRight: "16px" }}>
              运行模型
            </Button>
            <Progress style={{ marginTop: "4px" }} percent={percent} size="small" />
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export default App;

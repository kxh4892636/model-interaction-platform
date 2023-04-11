import { PlusOutlined, CheckOutlined } from "@ant-design/icons";
import {
  Button,
  Space,
  Form,
  Input,
  Popconfirm,
  Table,
  Radio,
  message,
  Select,
  Switch,
} from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import "./index.css";
import {
  useStore,
  Basic,
  Diet,
  DietCol,
  FleetModal,
  Detritus,
  FisheryDiscardFate,
  FisheryLandCol,
  FisheryLand,
  FisheryDiscard,
  FisheryDiscardCol,
  selectedEWEModelID,
} from "../store";
import { useData } from "../../../hooks";
import { useLayersStore } from "../../../stores/layers_store";
import axios from "axios";
const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  // console.log("...restProps",{...restProps})
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      console.log(form.validateFields());
      const values = await form.validateFields();
      // values就是更改后的值
      console.log(values);
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};
export default function App() {
  const dataActions = useData();
  const [SelectOptions, setSelectOptions] = useState([]);
  const setselectEWEModelID = selectedEWEModelID((state) => state.setEWEModelID);
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
        selectOptions.push({ value: layer.key, label: layer.title });
      }
    });
    return selectOptions;
  };

  useEffect(() => {
    setSelectOptions(createSelectOptions(layers.data));
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layers.data.length]);
  // Group 完成编辑
  const GrouphandleOk = () => {
    setGroupTData(GroupData);
    setDietColumns(GroupData);
    setDietData(GroupData);
    setDetritusData(GroupData);
    setLandData(GroupData);
    setDiscardData(GroupData);
  };
  // Group数据源Table store状态共享
  const GroupData = useStore((state) => state.GroupData);
  const setGroupData = useStore((state) => state.setGroupData);
  // 点击ok的同时将basic input的内容也进行更新状态
  const setGroupTData = Basic((state) => state.setGroupTData);
  // 点击ok的同时将diet的表头也进行更新状态
  const setDietColumns = DietCol((state) => state.setDietColumns);
  // 点击ok的同时将diet的内容也进行更新状态
  const setDietData = Diet((state) => state.setDietData);
  // 点击ok的同时将Detritus的内容也进行更新状态
  const setDetritusData = Detritus((state) => state.setDetritusData);
  // 点击ok的同时将Land的内容也进行更新状态
  const setLandData = FisheryLand((state) => state.setLandData);
  // 点击ok的同时将Discard的内容也进行更新状态
  const setDiscardData = FisheryDiscard((state) => state.setDiscardData);
  // const [GroupData, setGroupData] = useState([
  //   {
  //     key: '0',
  //     name: 'Detritus',
  //     age: '32',
  //     address: 'London, Park Lane no. 0',
  //     stgroup: "stgroup",
  //     type :1
  //   },
  // ]);
  const [count, setCount] = useState(2);
  // 删除一行
  const GroupTableDelete = (key) => {
    const newData = GroupData.filter((item) => item.key !== key);
    setGroupData(newData);
  };
  const GroupTableAdd = () => {
    const newData = {
      key: count,
      name: `Group ${count}`,
      age: "32",
      address: `London, Park Lane no. ${count}`,
      type: 0,
    };
    setGroupData([...GroupData, newData]);
    setCount(count + 1);
  };
  const GroupTableSave = (row) => {
    console.log("row", row);
    const newData = [...GroupData];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setGroupData(newData);
  };
  // Ratio选择框
  const onChange = (event, record) => {
    // console.log('radio1 checked', event.target.value,record);
    // setValue1(value)
    record.type = event.target.value;
    // console.log('radio1 checked', event.target.value,record);
  };
  const GroupColumns = [
    {
      title: "Group Name",
      dataIndex: "name",
      // width: '30%',
      editable: true,
      width: 150,
    },
    {
      title: "Type",
      dataIndex: "type",
      width: 350,
      // 三种方式实现事件处理函数中同时传event和其他参数 箭头函数实现
      render: (type, record) => (
        <Radio.Group defaultValue={type} onChange={(e) => onChange(e, record)}>
          <Radio value={0}>Consumer</Radio>
          <Radio value={1}>Producer</Radio>
          <Radio value={2}>Detritus</Radio>
        </Radio.Group>
      ),
    },
    {
      title: "operation",
      dataIndex: "operation",
      width: 150,
      // _, record 代表当前值和所在的全部值
      render: (_, record) =>
        GroupData.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => GroupTableDelete(record.key)}>
            <Button type="link">Delete</Button>
          </Popconfirm>
        ) : null,
    },
  ];
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = GroupColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: GroupTableSave,
      }),
    };
  });

  // Fleet弹出框
  // 点击ok的同时将DiscardFateData的内容也进行更新状态
  const setDiscardFateData = FisheryDiscardFate((state) => state.setDiscardFateData);
  // 点击ok的同时将LandCol的表头更新
  const setLandColumns = FisheryLandCol((state) => state.setLandColumns);
  // 点击ok的同时将DiscardCol的表头更新
  const setDiscardColumns = FisheryDiscardCol((state) => state.setDiscardColumns);

  // 确定完成Fleet的编辑
  const FleethandleOk = () => {
    setDiscardFateData(FleetData);
    setLandColumns(FleetData);
    setDiscardColumns(FleetData);
  };
  // Fleet数据源Table
  const FleetData = FleetModal((state) => state.FleetData);
  const setFleetData = FleetModal((state) => state.setFleetData);
  const [Fleetcount, setFleetCount] = useState(2);
  // 删除一行
  const FleetTableDelete = (key) => {
    const newData = FleetData.filter((item) => item.key !== key);
    setFleetData(newData);
  };
  const FleetTableAdd = () => {
    const newData = {
      key: Fleetcount,
      name: `Fleet ${Fleetcount}`,
      age: "32",
      address: `London, Park Lane no. ${Fleetcount}`,
    };
    setFleetData([...FleetData, newData]);
    setFleetCount(count + 1);
  };
  const FleetTableSave = (row) => {
    console.log("row", row);
    const newData = [...FleetData];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setFleetData(newData);
  };
  const FleetColumns = [
    {
      title: "Name",
      dataIndex: "name",
      // width: '30%',
      editable: true,
      width: 150,
    },
    {
      title: "operation",
      dataIndex: "operation",
      width: 150,
      // _, record 代表当前值和所在的全部值
      render: (_, record) =>
        FleetData.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => FleetTableDelete(record.key)}>
            <Button type="link">Delete</Button>
          </Popconfirm>
        ) : null,
    },
  ];
  const Fcolumns = FleetColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: FleetTableSave,
      }),
    };
  });

  // 从EWE输出数据ACCDB的文件中加载数据
  // 采用2 ，单纯更新状态
  const setDietData2 = Diet((state) => state.setDietData2);
  const setLandData2 = FisheryLand((state) => state.setLandData2);
  const setDiscardData2 = FisheryDiscard((state) => state.setDiscardData2);
  const LoadDATA = (response) => {
    setGroupData(response.Basic);
    setFleetData(response.DiscardFate);

    setGroupTData(response.Basic);

    // setDietColumns中采用Basic 因为仅用到了name和type
    setDietColumns(response.Basic);
    setDietData2(response.Diet);

    setDetritusData(response.Detritus);

    // setDietColumns中采用Basic 因为仅用到了name
    setLandColumns(response.DiscardFate);
    setLandData2(response.Land);

    setDiscardColumns(response.DiscardFate);
    setDiscardData2(response.Disc);

    setDiscardFateData(response.DiscardFate);
  };
  const ImportModel = async (id) => {
    message.loading({ content: "数据加载中", key: "Mloading" });
    axios({
      method: "post",
      baseURL: "http://localhost:3456/api/model/R_test3",
      data: { id: id },
    }).then((response) => {
      if (response.status === 200) {
        message.destroy("Mloading");
        message.success({ content: "数据加载成功！！！", duration: 1.25 });
      } else {
        message.destroy("Mloading");
        message.error(`数据加载失败`);
      }
      LoadDATA(response.data);
    });
  };
  // 控制显示与隐藏
  const [Mdisplaystate, setMdisplaystate] = useState("block");
  const [displaystate, setdisplaystate] = useState("none");
  const onChange333 = (checked) => {
    if (checked === true) {
      setMdisplaystate("block");
      setdisplaystate("none");
    } else {
      setMdisplaystate("none");
      setdisplaystate("block");
    }
  };
  return (
    <Space
      direction="vertical"
      size="middle"
      style={{
        display: "flex",
      }}
    >
      <Switch
        checkedChildren="直接导入"
        unCheckedChildren="手动定义"
        defaultChecked
        onChange={onChange333}
      />
      <div style={{ display: Mdisplaystate }}>
        <Space>
          <span>模型选择</span>
          <Select
            placeholder="请选择导入的模型"
            style={{
              width: 240,
            }}
            onChange={(value) => {
              // 先设置UUID 再执行计算
              setselectEWEModelID(value);
              ImportModel(value);
            }}
            options={SelectOptions}
          />
        </Space>
      </div>
      <div style={{ display: displaystate }}>
        <Space>
          <span>定义功能组</span>
          <Button
            onClick={GroupTableAdd}
            type="primary"
            style={{
              marginBottom: 5,
            }}
            shape="round"
            icon={<PlusOutlined />}
          ></Button>
          <Popconfirm
            title="确定完成功能组的定义？"
            // description="Are you sure to delete this task?"
            onConfirm={GrouphandleOk}
            // onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              style={{
                marginBottom: 5,
              }}
              shape="round"
              icon={<CheckOutlined />}
            ></Button>
          </Popconfirm>
        </Space>

        <Table
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          dataSource={GroupData}
          columns={columns}
          pagination={{ pageSize: 3 }}
          width="1200"
        />
      </div>
      <div style={{ display: displaystate }}>
        <Space>
          <span>定义舰船</span>
          <Button
            onClick={FleetTableAdd}
            type="primary"
            style={{
              marginBottom: 5,
            }}
            shape="round"
            icon={<PlusOutlined />}
          ></Button>
          <Popconfirm
            title="确定完成舰队的定义？"
            // description="Are you sure to delete this task?"
            onConfirm={FleethandleOk}
            // onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              style={{
                marginBottom: 5,
              }}
              shape="round"
              icon={<CheckOutlined />}
            ></Button>
          </Popconfirm>
        </Space>
        <Table
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          dataSource={FleetData}
          columns={Fcolumns}
          pagination={{ pageSize: 3 }}
        />
      </div>
    </Space>
  );
}

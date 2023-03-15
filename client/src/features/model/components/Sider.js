import { DownOutlined, CalendarOutlined,CreditCardFilled,ItalicOutlined,Loading3QuartersOutlined } from '@ant-design/icons';
import { Tree,Button, Space, Modal,Form, Input, Popconfirm, Table ,Radio,Upload,message } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import "./index.css"
import {useStore,Basic,Diet,DietCol,FleetModal,Detritus,FisheryDiscardFate,FisheryLandCol,FisheryLand,FisheryDiscard,FisheryDiscardCol} from "../store"
import { modalarray,Fleet } from '../exampledata';
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
      console.log(form.validateFields())
      const values = await form.validateFields();
      // values就是更改后的值
      console.log(values)
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
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

const App = (props) => {
  // Group弹出框
  const [GroupMoadal, setGroupMoadal] = useState(false);
  const GroupshowModal = () => {
    setGroupMoadal(true);
  };
  const GrouphandleOk = () => {
    setGroupTData(GroupData)
    setDietColumns(GroupData)
    setDietData(GroupData)
    setDetritusData(GroupData)
    setLandData(GroupData)
    setDiscardData(GroupData)
    setGroupMoadal(false);
  };
  const GrouphandleCancel = () => {
    setGroupMoadal(false);
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
      age: '32',
      address: `London, Park Lane no. ${count}`,
    };
    setGroupData([...GroupData, newData]);
    setCount(count + 1);
  };
  const GroupTableSave = (row) => {
    console.log("row",row)
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
  const onChange = (event,record) => {
    // console.log('radio1 checked', event.target.value,record);
    // setValue1(value)
    record.type = event.target.value
    // console.log('radio1 checked', event.target.value,record);
  };
  // 定义功能组，添加示例数据
  const AddGroupExample = ()=>{
    setGroupData(modalarray)
  }
  const GroupColumns = [
    {
      title: 'Group Name',
      dataIndex: 'name',
      // width: '30%',
      editable: true,
      width:150
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width:350,
      // 三种方式实现事件处理函数中同时传event和其他参数 箭头函数实现
      render: (type,record)=>     <Radio.Group defaultValue={type} onChange={(e)=> onChange(e,record)}>
      <Radio value={0}>Consumer</Radio>
      <Radio value={1}>Producer</Radio>
      <Radio value={2}>Detritus</Radio>
    </Radio.Group>
    },
    {
      title: 'Multi-stanza group name',
      dataIndex: 'stgroup',
      editable: true,
      width:200,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      width:150,
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
        handleSave:GroupTableSave
      }),
    };
  });



  // Fleet弹出框
  const [FleetMoadal, setFleetMoadal] = useState(false);
  // 点击ok的同时将DiscardFateData的内容也进行更新状态
  const setDiscardFateData = FisheryDiscardFate((state) => state.setDiscardFateData)
  // 点击ok的同时将LandCol的表头更新
  const setLandColumns = FisheryLandCol((state) => state.setLandColumns)
  // 点击ok的同时将DiscardCol的表头更新
  const setDiscardColumns = FisheryDiscardCol((state) => state.setDiscardColumns)
  const FleetshowModal = () => {
    setFleetMoadal(true);
  };
  const FleethandleOk = () => {
    setDiscardFateData(FleetData)
    setLandColumns(FleetData)
    setDiscardColumns(FleetData)
    setFleetMoadal(false);
  };
  const FleethandleCancel = () => {
    setFleetMoadal(false);
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
      key: count,
      name: `Fleet ${count}`,
      age: '32',
      address: `London, Park Lane no. ${Fleetcount}`,
    };
    setFleetData([...FleetData, newData]);
    setFleetCount(count + 1);
  };
  const FleetTableSave = (row) => {
    console.log("row",row)
    const newData = [...FleetData];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setFleetData(newData);
  };
  const AddFleetExample = ()=>{
    setFleetData(Fleet)
  }
  const FleetColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      // width: '30%',
      editable: true,
      width:150
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      width:150,
      // _, record 代表当前值和所在的全部值
      render: (_, record) => 
        FleetData.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => FleetTableDelete(record.key)}>
            <Button type="link">Delete</Button>
          </Popconfirm>
        ) : null,
    },
  ];
  const Fcolumns =FleetColumns.map((col) => {
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
        handleSave:FleetTableSave
      }),
    };
  });


  // 从EWE输出数据ACCDB的文件中加载数据
  // 采用2 ，单纯更新状态
  const setDietData2 = Diet((state) => state.setDietData2);
  const setLandData2 = FisheryLand((state) => state.setLandData2);
  const setDiscardData2 = FisheryDiscard((state) => state.setDiscardData2);
  const LoadDATA= (response)=>{
    // axios({
    //   method:'post', 
    //   baseURL: 'http://localhost:4000/test/R_test3',
    //   // data:{Group:GroupTData,Diet:DietData,Fleet:Fleet,Detritus:DetritusData,DiscardFate:FDiscardFateData,Land:FLandData,Discard:FDiscardData}
    // }).then(response=>{ 
    //   console.log(response)
    //   setGroupData(response.data.Basic)
    //   setFleetData(response.data.DiscardFate)

    //   setGroupTData(response.data.Basic)

    //   // setDietColumns中采用Basic 因为仅用到了name和type
    //   setDietColumns(response.data.Basic)
    //   setDietData2(response.data.Diet)

    //   setDetritusData(response.data.Detritus)

    //   // setDietColumns中采用Basic 因为仅用到了name
    //   setLandColumns(response.data.DiscardFate)
    //   setLandData2(response.data.Land)

    //   setDiscardColumns(response.data.DiscardFate)
    //   setDiscardData2(response.data.Disc)

    //   setDiscardFateData(response.data.DiscardFate)
    // })
    setGroupData(response.Basic)
    setFleetData(response.DiscardFate)

    setGroupTData(response.Basic)

    // setDietColumns中采用Basic 因为仅用到了name和type
    setDietColumns(response.Basic)
    setDietData2(response.Diet)

    setDetritusData(response.Detritus)

    // setDietColumns中采用Basic 因为仅用到了name
    setLandColumns(response.DiscardFate)
    setLandData2(response.Land)

    setDiscardColumns(response.DiscardFate)
    setDiscardData2(response.Disc)

    setDiscardFateData(response.DiscardFate)
  }

  let messageFlag = true
  // Upload 配置信息 
  const UpLoadprops = {
    name: 'file',
    action: 'http://localhost:3456/model/R_test3',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status === 'uploading' && messageFlag) {
        message.loading({content:"数据加载中",key:"Mloading"})
        messageFlag = !messageFlag
      }
      if(info.file.status !== 'uploading' && messageFlag===false){
        message.destroy("Mloading")
        messageFlag = !messageFlag
      }
      if (info.file.status === 'done') {
        message.success({content:"数据加载成功！！！",duration:1.25});
        LoadDATA(info.file.response)
        // info.file中有response，省去了axios
      } else if (info.file.status === 'error') {
        message.error(`数据加载失败`);
      }
    },
  };
  const treeData = [
    {
      title: 'Hydrodynamic Model',
      key: '0-1',
      // icon: <AliwangwangOutlined />,
      routekey:"model/Hydrodynamic",
    },
    {
      title: 'EWE',
      key: '0-2',
      // icon: <AliwangwangOutlined />,
      children:[
        {
          title: <Upload {...UpLoadprops}>
                    <Button type="text" size="small" onClick={()=>{
                      let DomArray = document.getElementsByClassName("ant-upload-list-text")
                      // });
                      for(var i=0;i<DomArray.length;i++){
                        if(DomArray[i].clientWidth===94){
                          console.log(DomArray[i].clientWidth)
                          DomArray[i].style.display = "none"
                        }
                      }
                      // document.getElementsByClassName("ant-upload-list-text")[0].style.display = "none"
                    }} 
                      style={{paddingLeft:0}}>Import Model</Button>
                 </Upload>,
          key: '0-2-1',
          routekey:"ImportModel",
          // icon: <RightCircleOutlined />,
        },      
        {
          title: 'Define Group',
          key: '0-2-2',
          routekey:"DefineGroup",
          // icon: <RightCircleOutlined />,
        },      
        {
          title: 'Define Fleet',
          key: '0-2-3',
          routekey:"DefineFleet",
          // icon: <RightCircleOutlined />,
        },
        {
          title: 'Ecopath',
          key: '0-3',
          // icon: <RightCircleOutlined />,
          children:[
            {
              title: 'Input',
              key: '1-0',
              icon: <ItalicOutlined />,
              children: [
                {
                  title: 'Basic Input',
                  key: '0-0-0',
                  routekey:"model/Group",
                  icon:  ({ selected }) => (selected ? <CreditCardFilled />: <CalendarOutlined />),
                },
                {
                  title: 'Diet Composition',
                  key: '0-0-1',
                  routekey:"model/Diet",
                  icon: ({ selected }) => (selected ? <CreditCardFilled />: <CalendarOutlined />),
                },
                {
                  title: 'Detritus Fate',
                  key: '0-0-2',
                  routekey:"model/DetritusFate",
                  icon: ({ selected }) => (selected ? <CreditCardFilled />: <CalendarOutlined />),
                },
                {
                  title: 'Fishery',
                  key: '0-0-3',
                  icon: ({ selected }) => (selected ? <CreditCardFilled />: <CalendarOutlined />),
                  children:[
                    {
                      title: 'Landing',
                      key: '0-0-3-0',
                      routekey:"model/Landing",
                      icon: ({ selected }) => (selected ? <CreditCardFilled />: <CalendarOutlined />),
                    },   
                    {
                      title: 'Discards',
                      key: '0-0-3-1',
                      routekey:"model/Discards",
                      icon: ({ selected }) => (selected ? <CreditCardFilled />: <CalendarOutlined />),
                    },  
                    {
                      title: 'Discard Fate',
                      key: '0-0-3-2',
                      routekey:"model/DiscardFate",
                      icon: ({ selected }) => (selected ? <CreditCardFilled />: <CalendarOutlined />),
                    },  
                  ]
                },
              ],
            },
            {
              title: 'Output',
              key: '2-0',
              icon: <Loading3QuartersOutlined />,
              children:[
                {
                  title: 'Basic Estimates',
                  key: '2-0-1',
                  routekey:"model/EcopathOutput",
                  icon:  ({ selected }) => (selected ? <CreditCardFilled />: <CalendarOutlined />)
                },
                {
                  title: 'Flow Diagram',
                  key: '2-0-2',
                  routekey:"model/FlowDiagram",
                  icon:  ({ selected }) => (selected ? <CreditCardFilled />: <CalendarOutlined />)
                }
              ]
            }
          ],
        },
        {
          title: 'Ecosim',
          key: '0-4',
          // icon: <AliwangwangOutlined />,
          children: [
            {
              title: 'leaf',
              key: '0-1-0',
              icon:({ selected }) => (selected ? <CalendarOutlined />: <CalendarOutlined />),
            },
            {
              title: 'leaf',
              key: '0-1-1',
              icon: ({ selected }) => (selected ? <CalendarOutlined />: <CalendarOutlined />),
            },
          ],
        },
      ]
    },

  ];
  return(
    <>
        <Tree
          showIcon
          // 默认展开指定的树节点
          defaultExpandedKeys={['0-2']}
          // 默认选中复选框的树节点
          // defaultSelectedKeys={['0-0-0']}
          switcherIcon={<DownOutlined />}
          treeData={treeData}
          onSelect={(_,e) => {
            if(e.node.routekey==="ImportModel"){
              console.log("ImportModel")
            }
            else if(e.node.routekey==="DefineGroup"){
              console.log("DefineGroup")
              GroupshowModal()
            }
            else if(e.node.routekey==="DefineFleet"){
              console.log("DefineFleet")
              FleetshowModal()
            }
            else{
              // 路由切换
              props.routechange(e.node.routekey)
            }

          }}
          style={{backgroundColor:"#fff"}}
        />
        <Modal width="1000px" title="Define Group" open={GroupMoadal} onOk={GrouphandleOk} onCancel={GrouphandleCancel}>
      <div>
        <Space>
          <Button
            onClick={GroupTableAdd}
            type="primary"
            style={{
              marginBottom: 16,
            }}
          >
            Add a row
          </Button>
          <Button
            onClick={AddGroupExample}
            type="primary"
            style={{
              marginBottom: 16,
            }}
          >
            Add Example
          </Button>
        </Space>

        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={GroupData}
          columns={columns}
          pagination={{ pageSize:7 }}
          width="1200"
        />
      </div>
        </Modal>
        <Modal title="Define Fleet" open={FleetMoadal} onOk={FleethandleOk} onCancel={FleethandleCancel}>
          <div>
            <Space>
              <Button
                  onClick={FleetTableAdd}
                  type="primary"
                  style={{
                    marginBottom: 16,
                  }}
                >
                  Add a row
              </Button>
              <Button
                onClick={AddFleetExample}
                type="primary"
                style={{
                  marginBottom: 16,
                }}
              >
                Add Example
              </Button>
            </Space>

          <Table
              components={components}
              rowClassName={() => 'editable-row'}
              bordered
              dataSource={FleetData}
              columns={Fcolumns}
              pagination={{ pageSize:7 }}
            />
          </div>

        </Modal>
    </>

    
  )

};
export default App;
import { Form, Input, Table } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Detritus,RunModelState,ModifyState } from '../store';

// 可编辑表格
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
  ModifyData,
  ModifyFuc,
  ModelState,
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
      const values = await form.validateFields();
      // values就是更改后的值
      // console.log(record,values)
      const newModifyData = [...ModifyData]
      newModifyData.push({tablename:"ecopathdiet",attribute:'detritus',value:parseInt(Object.values(values)[0]),attrgroup1:"predid",groupname1:record.name,attrgroup2:"preyid",groupname2:Object.keys(values)[0]})
      ModifyFuc(newModifyData)
      ModelState("Modify")
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
export default function App() {
    const DetritusData = Detritus((state) => state.DetritusData );
    const setDetritusData = Detritus((state) => state.setDetritusData );
    // 与数据库联动的Modify操作
    const ModifyData = ModifyState((state)=>state.ModifyData)
    const setModifyData = ModifyState((state)=>state.setModifyData)
    const setModelState = RunModelState((state)=>state.setState)
    const defaultColumns =[
        {
            title: 'Source \\ Fate',
            dataIndex: 'name',
            key: 'group',
            fixed: 'left',
            width:150
          },
          {
            title: 'Detritus', 
            dataIndex: 'Detritus',
            key: 'Detritus',
            editable:true,
            width:100
          },
          {
            title: 'Export', 
            dataIndex: 'Export',
            key: 'Export',
            editable:true,
            width:100
          },
          {
            title: 'Sum', 
            dataIndex: 'Sum',
            key: 'Sum',
            editable:true,
            width:100
          },
    ]
    const columns = defaultColumns.map((col) => {
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
            ModifyData:ModifyData,
            ModifyFuc:setModifyData,
            ModelState:setModelState,
            handleSave,
          }),
        };
      });
    const handleSave = (row) => {
        // console.log("row",row)
        const newData = [...DetritusData];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setDetritusData(newData);
      };
    const components = {
        body: {
          row: EditableRow,
          cell: EditableCell,
        },
      };
  return (
    <>
        <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={DetritusData}
        columns={columns}
        pagination={{ pageSize:100 }}
        scroll={{y:500}}
        size="small"
        style={{width:500}}
      />
    </>
  )
}

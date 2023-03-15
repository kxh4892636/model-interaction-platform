import { Button,Form, Input, Table } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Detritus } from '../store';
import { DetritusExample } from '../exampledata';
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
export default function App() {
    const DetritusData = Detritus((state) => state.DetritusData );
    const setDetritusData = Detritus((state) => state.setDetritusData );
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
            handleSave,
          }),
        };
      });
    const handleSave = (row) => {
        console.log("row",row)
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
        <Button onClick={()=>{setDetritusData(DetritusExample)}} type="primary" style={{marginBottom: 16}}>Add Example</Button>
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

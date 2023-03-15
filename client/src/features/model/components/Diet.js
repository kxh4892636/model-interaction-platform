import { Form, Input, Table, Button } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Diet,DietCol } from '../store';
import { DietExample } from '../exampledata';
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
      // console.log(form.validateFields(),"record",record)
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
  const DietData = Diet((state) => state.DietData);
  let ref = useRef()
  ref.current = DietData
  const setDietData = Diet((state) => state.setDietData2);
  const DietColumns = DietCol((state) => state.DietColumns);
  const setDietColumns = DietCol((state) => state.setDietColumns2);
  // store中完成对define group中的消费者与生产者的数组对象生成，useffect中对表头属性绑定editable以及编辑属性
  useEffect(()=>{
    const columns = DietColumns.map((col) => {
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
    setDietColumns(columns)
    //eslint-disable-next-line react-hooks/exhaustive-deps
  },[DietColumns.length])
  const handleSave = (row) => {
    console.log("row",row)
    const newData = [...ref.current];
    console.log("newdata",newData)
    console.log("DietData",DietData)
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDietData(newData);
    ref.current = newData
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  return (
    <>
      <Button
        // onClick={AddFleetExample}
        type="primary"
        style={{
          marginBottom: 16,
        }}
        onClick={()=>{
          setDietData(DietExample)
        }}
      >
        Add Example
      </Button>
        <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={DietData}
        columns={DietColumns}
        pagination={{ pageSize:100 }}
        scroll={{ x: 3500 , y: 500 }}
        size="small"
      />
    </>
  )
}


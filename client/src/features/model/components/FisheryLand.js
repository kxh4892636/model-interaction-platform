import { Button,Form, Input, Table } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FisheryLand,FisheryLandCol } from '../store';
import { LandingExample } from '../exampledata';
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
    const LandData = FisheryLand((state) => state.LandData );
    let ref = useRef()
    ref.current = LandData
    const setLandData = FisheryLand((state) => state.setLandData2 );
    const LandColumns = FisheryLandCol((state) => state.LandColumns)
    const setLandColumns = FisheryLandCol((state) => state.setLandColumns2)
    // store中完成对define group中的消费者与生产者的数组对象生成，useffect中对表头属性绑定editable以及编辑属性
    useEffect(()=>{
        const columns = LandColumns.map((col) => {
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
        setLandColumns(columns)
        //eslint-disable-next-line react-hooks/exhaustive-deps
    },[LandColumns.length])
    const handleSave = (row) => {
        console.log("row",row)
        const newData = [...ref.current];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setLandData(newData);
        ref.current = newData
        // console.log(newData)
      };
    const components = {
        body: {
          row: EditableRow,
          cell: EditableCell,
        },
      };
  return (
    <>
        <Button onClick={()=>{setLandData(LandingExample)}} type="primary" style={{marginBottom: 16}}>Add Example</Button>
        <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={LandData}
        columns={LandColumns}
        pagination={{ pageSize:100 }}
        scroll={{y:500}}
        size="small"
/>
    </>
  )
}

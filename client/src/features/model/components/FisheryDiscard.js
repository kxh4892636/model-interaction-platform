import {Form, Input, Table } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FisheryDiscard,FisheryDiscardCol,RunModelState,ModifyState } from '../store';
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
      // console.log(form.validateFields())
      const values = await form.validateFields();
      // values就是更改后的值
      // console.log(record)
      const newModifyData = [...ModifyData]
      newModifyData.push({tablename:"ecopathcatch",attribute:'discards',value:parseInt(Object.values(values)[0]),attrgroup:"groupid",groupname:record.name})
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
    const DiscardData = FisheryDiscard((state) => state.DiscardData );
    let ref = useRef()
    ref.current = DiscardData
    const setDiscardData = FisheryDiscard((state) => state.setDiscardData2 );
    const DiscardColumns = FisheryDiscardCol((state) => state.DiscardColumns);
    const setDiscardColumns = FisheryDiscardCol((state) => state.setDiscardColumns2 );
    // 与数据库联动的Modify操作
    const ModifyData = ModifyState((state)=>state.ModifyData)
    const setModifyData = ModifyState((state)=>state.setModifyData)
    const setModelState = RunModelState((state)=>state.setState)
    // store中完成对define group中的消费者与生产者的数组对象生成，useffect中对表头属性绑定editable以及编辑属性
    useEffect(()=>{
      const columns = DiscardColumns.map((col) => {
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
      //在检测变量中添加ModifyData.length，由于属性列的初始化在useeffect中生成，
      //好像貌似只有每次useeffect的时候ModifyData才会被检测一次
      //如果不这样，ModifyData永远只会记录最新的那个值，长度永远唯一
      //添加ModifyData.length后，只要一修改就会刷新重新读新的ModifyData
      setDiscardColumns(columns)
      //eslint-disable-next-line react-hooks/exhaustive-deps
  },[DiscardColumns.length,ModifyData.length])
  const handleSave = (row) => {
    // console.log("row",row)
    const newData = [...ref.current];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDiscardData(newData);
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
        <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={DiscardData}
        columns={DiscardColumns}
        pagination={{ pageSize:100 }}
        scroll={{y:500}}
        size="small"
      />
    </>
  )
}

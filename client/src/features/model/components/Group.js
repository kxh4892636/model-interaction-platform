import { Form, Input, Table, Button } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {Basic} from "../store"
import { GroupExample } from '../exampledata';
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

export default function Group() {
  const GroupTData = Basic((state) => state.GroupTData);
  const setGroupTData = Basic((state) => state.setGroupTData);
  // const [GroupTData, setGroupTData] = useState([
  //   {
  //     BioAcc: 0,
  //     Biomass: 0.0149,
  //     DetInput: "NA",
  //     Detritus: 1,
  //     Discards: 0,
  //     Dredgers: 0,
  //     Dredgersdisc: 0,
  //     EE: "NA",
  //     Midwater: 0,
  //     Midwaterdisc: 0,
  //     PB: 0.098,
  //     ProdCons: "NA",
  //     QB: 76.75,
  //     Trawlers: 0,
  //     Trawlersdisc: 0.00001,
  //     UNAssim: 0.2,
  //     name: "Seabirds",
  //     stgroup: "NA",
  //     type: 0,
  //     key:"Seabirds"
  //   }
  // ]);
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const defaultColumns = [
    {
      title: 'Group',
      dataIndex: 'name',
      key: 'group',
      fixed: 'left',
    },
    {
      title: 'Biomass',
      dataIndex: 'Biomass',
      key: 'Biomass',
      editable:true,
    },
    {
      title: 'PB', 
      dataIndex: 'PB',
      key: 'PB',
      editable:true
    },
    {
      title: 'QB',
      dataIndex: 'QB',
      key: 'QB',
      editable:true
    },
    {
      title: 'EE',
      dataIndex: 'EE',
      key: 'EE',
      editable:true
    },
    {
      title: 'ProdCons',
      dataIndex: 'ProdCons',
      key: 'ProdCons',
      editable:true
    },
    {
      title: 'BiomAcc',
      dataIndex: 'BiomAcc',
      key: 'BiomAcc',
      editable:true
    },
    {
      title: 'Unassim',
      dataIndex: 'Unassim',
      key: 'Unassim',
      editable:true
    },
    {
      title: 'DetInput',
      dataIndex: 'DetInput',
      key: 'DetInput',
      editable:true
    },
    {
      title: 'Detritus',
      dataIndex: 'Detritus',
      key: 'Detritus',
      editable:true
    }
  ];
  const handleSave = (row) => {
    console.log("row",row)
    const newData = [...GroupTData];
    console.log("newdata",newData)
    console.log("GroupTData",GroupTData)
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setGroupTData(newData);
  };
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return {
        ...col,
        // align:"center",
        width:150
      }
    }
    return {
      ...col,
      // width:'50%',
      // align:"center",
      onCell: (record) => ({
        record,
        editable: col.editable, 
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });
  return (
    <>
      <Button
        // onClick={AddFleetExample}
        type="primary"
        style={{
          marginBottom: 16,
        }}
        onClick={()=>{setGroupTData(GroupExample)}}
      >
        Add Example
      </Button>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={GroupTData}
        columns={columns}
        pagination={{ pageSize:100}}
        size="small"
        scroll={{y:500,x:2000}}
        // style={{width:"1000px"}}
      />
    </>

  )
}

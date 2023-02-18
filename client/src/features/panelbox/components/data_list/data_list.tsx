/*
 * @File: DataList component
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-02-16
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import styled from "styled-components";
import { List, Button } from "antd";
import useAddData from "../../../../hooks/use_add_data";
import { DataListData } from "../../types";

// modify sytle of antd list component
const StyledList = styled(List)`
  && .ant-list-item-meta {
    margin-block-end: 12px;
  }
`;
// DataList title Style
const StyledTitle = styled.div`
  :hover {
    color: #4096ff;
    cursor: pointer;
  }
`;

type AppProps = {
  data: DataListData[];
  setShowDetail: React.Dispatch<React.SetStateAction<boolean>>;
  setselectedItem: React.Dispatch<React.SetStateAction<string>>;
};

/**
 * @description DataList component
 * @module DataList
 * @Author xiaohan kong
 * @param data datalist's data
 * @param setShowDetail click event for the datalist title, enter the data detail page
 * @export module: DataList
 */
const DataList = ({ data, setShowDetail, setselectedItem }: AppProps) => {
  const addData = useAddData();

  return (
    <>
      <StyledList
        itemLayout="vertical"
        pagination={{
          pageSize: 5,
        }}
        dataSource={data}
        renderItem={(item: any) => (
          <List.Item
            key={item.key}
            // button click event
            actions={[
              <Button size="small" onClick={() => addData(item.key)}>
                <span id={item.key}>添加至项目</span>
              </Button>,
            ]}
            extra={<img width={120} height={90} alt="logo" src={item.image} />}
          >
            <List.Item.Meta
              // title click event
              title={
                <StyledTitle
                  id={item.key}
                  onClick={(e) => {
                    setselectedItem((e.target as any).id);
                    setShowDetail(true);
                  }}
                >
                  {item.title}
                </StyledTitle>
              }
              description={`上传者 ${item.author}`}
            />
          </List.Item>
        )}
      />
    </>
  );
};

export default DataList;

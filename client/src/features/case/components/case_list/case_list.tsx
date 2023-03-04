/*
 * @File: CaseList component
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-02-16
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import styled from "styled-components";
import { List, Button } from "antd";
import { useData } from "../../../../hooks";
import { CaseListData } from "../../types";

// modify sytle of antd list component
const StyledList = styled(List)`
  && .ant-list-item-meta {
    margin-block-end: 12px;
  }
`;
// CaseList title Style
const StyledTitle = styled.div`
  :hover {
    color: #4096ff;
    cursor: pointer;
  }
`;

type AppProps = {
  data: CaseListData[];
  onShow: (id: string) => void;
};

/**
 * @description CaseList component
 * @module CaseList
 * @Author xiaohan kong
 * @param data CaseList's data
 * @param setShowDetail click event for the CaseList title, enter the case detail page
 * @export module: CaseList
 */
const CaseList = ({ data, onShow }: AppProps) => {
  const dataAction = useData();

  const handleClick = (data: CaseListData) => {
    data.data.forEach((id) => {
      dataAction.addData(id);
    });
  };

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
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  handleClick(item);
                }}
              >
                添加至地图
              </Button>,
            ]}
            extra={<img width={130} height={90} alt="logo" src={item.image} />}
          >
            <List.Item.Meta
              // title click event
              title={
                <StyledTitle
                  id={item.key}
                  onClick={(e) => {
                    onShow((e.target as any).id);
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

export default CaseList;

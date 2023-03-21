/*
 * @File: DataPanel component
 * @Author: xiaohan kong
 * @Date: 2023-02-20
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-02-20
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import styled from "styled-components/macro";
import axios from "axios";
import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload, List } from "antd";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { PanelContainer } from "../../components/layout";
import { useData } from "../../hooks";
import { ServerData } from "../../types";
import CasePage from "../case/components/case_detail_page/Case_detail_page";

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

// modify style of antd upload component
const StyledUpload = styled(Upload)`
  padding: 0px 10px;
`;

/**
 * @description DataPanel component
 * @module DataPanel
 * @author xiaohan kong
 * @export module: DataPanel
 */
const DataPanel = () => {
  const dataActions = useData();
  const [current, setCurrent] = useState("upload");
  const [data, setData] = useState<ServerData[]>([]);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedItem, setselectedItem] = useState("");
  const items: TabsProps["items"] = [
    {
      key: "upload",
      label: `数据上传`,
    },
    {
      key: "list",
      label: `数据清单`,
    },
  ];

  useEffect(() => {
    axios.get("http://localhost:3456/data/list").then((res) => {
      const data = (res.data as { [props: string]: any }[]).map((value) => {
        return value as ServerData;
      });
      setData(data);
    });
  }, []);

  return (
    <PanelContainer>
      {showDetail ? (
        <CasePage
          id={selectedItem}
          onClose={() => {
            setShowDetail(false);
          }}
        />
      ) : (
        <></>
      )}
      <Tabs
        defaultActiveKey="upload"
        items={items}
        type={"card"}
        style={{ paddingBlockStart: "6px" }}
        onChange={(key) => {
          setCurrent(key);
        }}
      />
      {current === "upload" ? (
        <StyledUpload
          name="file"
          headers={{ authorization: "authorization-text" }}
          action={"http://localhost:3456/data/upload"}
          onChange={(info) => {
            if (info.file.status === "done") {
              message.success(`${info.file.name} file uploaded successfully`);
              // TODO 添加案例时相同案例数据放置于一个图层组内
              dataActions.addDataToMap(info.file.response);
              dataActions.addDataToLayerTree(info.file.response);
            }
          }}
          method="post"
          multiple
        >
          <Button icon={<UploadOutlined />}>上传文件</Button>
        </StyledUpload>
      ) : (
        <></>
      )}
      {current === "list" ? (
        <StyledList
          itemLayout="vertical"
          pagination={{
            pageSize: 5,
          }}
          dataSource={data}
          renderItem={(item: any) => (
            <List.Item
              key={item.id}
              // button click event
              actions={[
                <Button size="small" onClick={() => dataActions.addDataToMap(item.id)}>
                  <span id={item.id}>添加至项目</span>
                </Button>,
              ]}
              extra={<img width={120} height={90} alt="logo" src={item.image} />}
            >
              <List.Item.Meta
                // title click event
                title={
                  <StyledTitle
                    id={item.id}
                    onClick={(e) => {
                      setselectedItem(e.currentTarget.id);
                      setShowDetail(true);
                    }}
                  >
                    {item.title}
                  </StyledTitle>
                }
                description={`上传者 kxh`}
              />
            </List.Item>
          )}
        />
      ) : (
        <></>
      )}
    </PanelContainer>
  );
};
export default DataPanel;

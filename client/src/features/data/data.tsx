/*
 * @File: DataPanel component
 * @Author: xiaohan kong
 * @Date: 2023-02-20
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-02-20
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import styled from "styled-components";
import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload } from "antd";
import { PanelContainer, PanelTitleContainer } from "../../components/layout";
import { useData } from "../../hooks";

// modify style of antd upload component
const StyledUpload = styled(Upload)`
  padding: 6px 10px;
`;

/**
 * @description DataPanel component
 * @module DataPanel
 * @author xiaohan kong
 * @export module: DataPanel
 */
const DataPanel = () => {
  const dataActions = useData();
  return (
    <PanelContainer>
      <PanelTitleContainer>数据面板</PanelTitleContainer>
      <StyledUpload
        name="file"
        headers={{ authorization: "authorization-text" }}
        action={"http://localhost:3456/data/upload"}
        onChange={(info) => {
          if (info.file.status === "done") {
            message.success(`${info.file.name} file uploaded successfully`);
            // TODO 添加案例时相同案例数据放置于一个图层组内
            dataActions.addData(info.file.response);
          }
        }}
        method="post"
        multiple
      >
        <Button icon={<UploadOutlined />}>上传文件</Button>
      </StyledUpload>
    </PanelContainer>
  );
};
export default DataPanel;

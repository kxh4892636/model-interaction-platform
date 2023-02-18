/*
 * @File: UploadPanel component
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-02-16
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import styled from "styled-components";
import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload } from "antd";

// UploadPanel title container
const DataPanelTitle = styled.div`
  height: 5vh;
  line-height: 5vh;
  padding: 0 12px;
  background: #fff;
  border-bottom: 1px solid #d9d9d9;
`;
// modify style of antd upload component
const StyledUpload = styled(Upload)`
  padding: 6px 10px;
`;

/**
 * @description UploadPanel
 * @module UploadPanel
 * @author xiaohan kong
 * @export module: UploadPanel
 */
const UploadPanel: React.FC = () => {
  return (
    <>
      <DataPanelTitle>数据上传面板</DataPanelTitle>
      <StyledUpload
        name="file"
        action={"https://www.mocky.io/v2/5cc8019d300000980a055e76"}
        onChange={(info) => {
          if (info.file.status !== "uploading") {
            console.log(info.file, info.fileList);
          }
          if (info.file.status === "done") {
            message.success(`${info.file.name} file uploaded successfully`);
          } else if (info.file.status === "error") {
            message.error(`${info.file.name} file upload failed.`);
          }
        }}
        multiple
      >
        <Button icon={<UploadOutlined />}>上传文件</Button>
      </StyledUpload>
    </>
  );
};

export default UploadPanel;

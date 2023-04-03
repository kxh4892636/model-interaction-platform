/*
 * @File: DataPanel component
 * @Author: xiaohan kong
 * @Date: 2023-02-20
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-03-24
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import styled from "styled-components/macro";
import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload } from "antd";
import { PanelContainer, PanelTitleContainer } from "../../components/layout";
import { useData } from "../../hooks";
import useProjectStatusStore from "../../stores/project_status_store";
import { useRef, useState } from "react";
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
  const setIsSpinning = useProjectStatusStore((state) => state.setIsSpinning);
  const [uploadFilesNum, setUploadFilesNum] = useState(0);
  const currentUploadFilesNum = useRef(0);

  return (
    <PanelContainer>
      <PanelTitleContainer>数据面板</PanelTitleContainer>
      <StyledUpload
        name="file"
        headers={{ authorization: "authorization-text" }}
        action={"http://localhost:3456/data/upload"}
        beforeUpload={(file, fileList) => {
          if (uploadFilesNum !== 0) return;
          else {
            setUploadFilesNum(fileList.length);
            setIsSpinning(true);
          }
        }}
        onChange={(info) => {
          if (info.file.status === "done") {
            currentUploadFilesNum.current += 1;
            message.success(`${info.file.name} 文件上传成功`);
            dataActions.addDataToMap(info.file.response);
            dataActions.addDataToLayerTree(info.file.response);
          }
          if (currentUploadFilesNum.current === uploadFilesNum) setIsSpinning(false);
          else;
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

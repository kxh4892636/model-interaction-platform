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
import { EWEModelID } from "../model/store";
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
  const EWEID:any = EWEModelID((state)=>state.EWEModelID)
  const setEWEID:any = EWEModelID((state)=>state.setEWEModelID)
  return (
    <PanelContainer>
      <PanelTitleContainer>数据面板</PanelTitleContainer>
      <StyledUpload
        name="file"
        headers={{ authorization: "authorization-text" }}
        action={"http://localhost:3456/data/upload"}
        onChange={(info) => {
          if (info.file.status === "done") {
            message.success(`${info.file.name} 文件上传成功`);
            if(info.file.name.split(".")[1]==="eweaccdb" || info.file.name.split(".")[1]==="ewemdb")
            {
              console.log(info.file.response)
              setEWEID([...EWEID,info.file.response])
            }
            else{
              // TODO 添加案例时相同案例数据放置于一个图层组内
              dataActions.addDataToMap(info.file.response);
              dataActions.addDataToLayerTree(info.file.response);
            }
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

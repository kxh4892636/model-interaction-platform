/*
 * @File: save_panel
 * @Author: xiaohan kong
 * @Date: 2023-03-28
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-11
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import { Button } from "antd";
import { useState } from "react";
import styled from "styled-components/macro";
import {
  PanelContainer,
  PanelContentContainer,
  PanelTitleContainer,
  PanelToolsContainer,
} from "../../components/layout";
import { useProjectStatusStore } from "../../stores/project_status_store";
import { UpdateProjectPanel } from "./components";
import { ProjectDetailPage } from "./components/project_detail_pange";

const StyledButton = styled(Button)`
  /* margin: 0px 2px; */
  margin-right: auto;
  margin-left: 6px;
`;

/**
 * @description save panel
 * @module SavePanel
 * @author xiaohan kong
 * @export module: SavePanel
 */
export const ProjectInfoPanel = () => {
  const [isShowSaveInfo, setIsShowSaveInfo] = useState(false);
  const projectKey = useProjectStatusStore((state) => state.key);

  return (
    <PanelContainer>
      <PanelTitleContainer>项目详情</PanelTitleContainer>
      <PanelContentContainer>
        {isShowSaveInfo ? (
          <UpdateProjectPanel setIsShowSaveInfo={setIsShowSaveInfo}></UpdateProjectPanel>
        ) : (
          <ProjectDetailPage id={projectKey}></ProjectDetailPage>
        )}
      </PanelContentContainer>
      <PanelToolsContainer style={{ border: "0px" }}>
        {!isShowSaveInfo && (
          <StyledButton
            style={{ margin: "0px 12px", marginLeft: "220px" }}
            type="primary"
            onClick={() => setIsShowSaveInfo(true)}
          >
            更新项目详情
          </StyledButton>
        )}
      </PanelToolsContainer>
    </PanelContainer>
  );
};

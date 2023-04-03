/*
 * @File: save_panel
 * @Author: xiaohan kong
 * @Date: 2023-03-28
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-03-28
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
import { SaveCasePanel, SaveProjectPanel } from "./components";

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
const SavePanel = () => {
  const [isShowSaveInfo, setIsShowSaveInfo] = useState("");

  return (
    <PanelContainer>
      <PanelTitleContainer>保存面板</PanelTitleContainer>
      <PanelToolsContainer>
        <StyledButton onClick={() => setIsShowSaveInfo("project")}>保存项目</StyledButton>
        <StyledButton onClick={() => setIsShowSaveInfo("case")}>保存数据集</StyledButton>
        <StyledButton type="text"></StyledButton>
        <StyledButton type="text"></StyledButton>
        <StyledButton type="text"></StyledButton>
      </PanelToolsContainer>
      <PanelContentContainer>
        {isShowSaveInfo === "project" ? (
          <SaveProjectPanel setIsShowSaveInfo={setIsShowSaveInfo}></SaveProjectPanel>
        ) : (
          <></>
        )}
        {isShowSaveInfo === "case" ? (
          <SaveCasePanel setIsShowSaveInfo={setIsShowSaveInfo}></SaveCasePanel>
        ) : (
          <></>
        )}
      </PanelContentContainer>
    </PanelContainer>
  );
};

export default SavePanel;

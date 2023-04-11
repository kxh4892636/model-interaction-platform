/*
 * @File: PanelTool component
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-09
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import styled from "styled-components/macro";
import { Tooltip } from "antd";

// DataTool Style
const StyledDiv = styled.div`
  height: 40px;
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  :hover {
    color: #4096ff;
  }
`;

/**
 * @description DataTools component
 * @autor xiaohan kong
 * @param title tool title
 * @param icon tool icon
 * @param action tool's click event
 */
type AppProps = { title: string; icon: JSX.Element; action: Function };
export const DataTools = ({ title, icon, action }: AppProps) => {
  return (
    <Tooltip placement="bottom" title={title}>
      <StyledDiv
        // tool click event
        onClick={() => {
          action();
        }}
      >
        {icon}
      </StyledDiv>
    </Tooltip>
  );
};

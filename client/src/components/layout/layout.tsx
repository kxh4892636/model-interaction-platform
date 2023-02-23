/*
 * @Author: xiaohan kong
 * @Date: 2023-02-10
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-02-10
 * @Description: Panel layout
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

// NOTE 布局组件的心得, 只设置高度
import styled from "styled-components";

/**
 * Panel component container
 */
export const PanelContainer = styled.div`
  display: flex;
  flex-flow: column;
`;
/**
 * panel title container
 */
export const PanelTitleContainer = styled.div`
  height: 5vh;
  line-height: 5vh;
  padding: 0px 12px;
  background: #fff;
  border-bottom: 1px solid #d9d9d9;
`;
/**
 * panel tools container
 */
export const PanelToolsContainer = styled.div`
  height: 4vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  border-bottom: 1px solid #d9d9d9;
`;

/**
 * panel tool container
 */
export const PanelToolContainer = styled.div`
  height: 4vh;
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
`;

// panel content container
export const PanelContentContainer = styled.div`
  background: #fff;
  flex: 1 1 0;
`;

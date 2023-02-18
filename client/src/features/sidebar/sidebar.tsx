/*
 * @Author: xiaohan kong
 * @Date: 2023-02-10
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-02-10
 * @Description: sidebar 组件
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import styled from "styled-components";
import React, { useState } from "react";
import { Tooltip } from "antd";
import { SidebarItem } from "./types";

// 侧边栏样式
const Aside = styled.aside`
  display: flex;
  flex-direction: column;
  height: 94vh;
  width: 60px;
  background: #434343;
  border-right: 1px solid #262626;
`;
// 侧边栏图标样式
const AsideItem = styled.div`
  padding: 14px 0;
  height: auto;
  border-radius: 0;
  border-color: rgba(0, 0, 0, 0);
  color: #8c8c8c;
  background: rgba(0, 0, 0, 0);
  text-align: center;
  &&:hover {
    background: #262626;
    border-color: rgba(0, 0, 0, 0);
  }
`;
// 展开 Panel 样式
const PanelContainer = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;
  height: 94vh;
  width: 340px;
  background: #fff;
  border-right: 1px solid #d9d9d9;
`;

/**
 * @description: 传入 item, 渲染 Sidebar 组件
 * @module Sidebar
 * @Author xiaohan kong
 * @param items SidebarItem 类型
 * @param position 侧边栏位置, 有 left 和 right 两种参数
 * @param style 侧边栏子项的样式
 * @export module: Sidebar
 */
const Sidebar: React.FC<{
  items: SidebarItem[];
  position?: string;
  style?: React.CSSProperties;
}> = ({ items, position = "left", style }) => {
  const [showPanelID, setShowPanelID] = useState("");
  const [showItem, setshowItem] = useState(false);
  // 渲染侧边栏
  const sidebarItems = items.map((value): JSX.Element => {
    return (
      <Tooltip placement="right" title={value.title} key={crypto.randomUUID()}>
        <AsideItem
          id={value.id}
          onClick={(e) => {
            // panel 展开状态下切换 panel 禁止关闭 panel
            if (showItem && e.currentTarget.id !== showPanelID) {
            } else {
              setshowItem(!showItem);
            }
            // 多次点击同一面板, 切换面板状态
            if (showPanelID === e.currentTarget.id) {
              setShowPanelID("");
            } else {
              setShowPanelID(e.currentTarget.id);
            }
          }}
          style={{ background: showPanelID === value.id ? "#262626" : "" }}
        >
          {value.icon}
        </AsideItem>
      </Tooltip>
    );
  });

  return (
    <>
      {showItem && position === "right" ? (
        <PanelContainer>
          <Item selectID={showPanelID} items={items} />
        </PanelContainer>
      ) : (
        <></>
      )}
      <Aside style={style}>{sidebarItems}</Aside>
      {showItem && position === "left" ? (
        <PanelContainer>
          <Item selectID={showPanelID} items={items} />
        </PanelContainer>
      ) : (
        <></>
      )}
    </>
  );
};

/**
 * @description 返回对应的面板组件
 * @Author xiaohan kong
 * @param selectID 面板 ID
 * @param items SidebarItem 类型
 */
const Item: React.FC<{ selectID: string; items: SidebarItem[] }> = ({ selectID, items }) => {
  const panel = items.filter((value) => {
    if (value.id !== selectID) {
      return false;
    }
    return true;
  });

  return panel.length ? panel[0].panel : <></>;
};

export default Sidebar;

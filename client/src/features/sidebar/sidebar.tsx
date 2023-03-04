/*
 * @Author: xiaohan kong
 * @Date: 2023-02-10
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-02-10
 * @Description: sidebar component
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import styled from "styled-components";
import React, { useState } from "react";
import { Tooltip } from "antd";
import { SidebarItem } from "./types";

// aside style
const Aside = styled.aside`
  display: flex;
  flex-direction: column;
  height: 94vh;
  width: 60px;
  background: #434343;
  border-right: 1px solid #262626;
`;
// aside item style
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
// panel style
const PanelContainer = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;
  height: 94vh;
  width: 340px;
  background: #fff;
  border-right: 1px solid #d9d9d9;
`;

type Position = "left" | "right";

type AppProps = {
  items: SidebarItem[];
  position?: Position;
  style?: React.CSSProperties;
};

/**
 * @description: sidebar component
 * @module Sidebar
 * @Author xiaohan kong
 * @param items sidebar items
 * @param position sidebar position
 * @param style style item style
 * @export module: Sidebar
 */
const Sidebar = ({ items, position = "left", style }: AppProps) => {
  const [showPanelID, setShowPanelID] = useState("");
  const [showItem, setshowItem] = useState(false);
  const sidebarItems = items.map((value): JSX.Element => {
    return (
      <Tooltip placement="right" title={value.title} key={crypto.randomUUID()}>
        <AsideItem
          id={value.id}
          onClick={(e) => {
            if (showItem && e.currentTarget.id !== showPanelID) {
            } else {
              setshowItem(!showItem);
            }
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

type AppProps2 = { selectID: string; items: SidebarItem[] };

/**
 * @description the panel of item
 * @Author xiaohan kong
 * @param selectID panel id
 * @param items items
 */
const Item = ({ selectID, items }: AppProps2) => {
  const panel = items.filter((value) => {
    if (value.id !== selectID) {
      return false;
    }
    return true;
  });

  return panel.length ? panel[0].panel : <></>;
};

export default Sidebar;

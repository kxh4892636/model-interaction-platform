/*
 * @Author: xiaohan kong
 * @Date: 2023-02-10
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-11
 * @Description: sidebar component
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import styled from "styled-components/macro";
import { useState } from "react";
import { SidebarItem } from "./types";
import { Tooltip } from "antd";

// aside style
const Aside = styled.aside`
  display: flex;
  flex-direction: column;
  width: 60px;
  background: "#fff";
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
    background: #f0f0f0;
    border-color: rgba(0, 0, 0, 0);
  }
`;
// panel style
const PanelContainer = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;
  width: 360px;
  background: #fff;
  max-height: 91vh;
`;

/**
 * @description the panel of item
 * @Author xiaohan kong
 * @param selectID panel id
 * @param items items
 */
type ItemProps = { selectID: string; items: SidebarItem[] };
const Item = ({ selectID, items }: ItemProps) => {
  const panel = items.filter((value) => {
    if (value.id !== selectID) {
      return false;
    }
    return true;
  });

  return panel.length ? panel[0].panel : <></>;
};

/**
 * @description: sidebar component
 * @module Sidebar
 * @Author xiaohan kong
 * @param items sidebar items
 * @param position sidebar position
 * @param theme the theme of sidebar
 * @export module: Sidebar
 */
type SidebarProps = {
  items: SidebarItem[];
};
export const Sidebar = ({ items }: SidebarProps) => {
  const [showPanelID, setShowPanelID] = useState("");
  const [showItem, setShowItem] = useState(false);

  const sidebarItems = items.map((value): JSX.Element => {
    return (
      <Tooltip placement="right" title={value.title} key={crypto.randomUUID()}>
        <AsideItem
          onClick={() => {
            if (showItem && value.id !== showPanelID) {
            } else {
              setShowItem(!showItem);
            }
            if (showPanelID === value.id) {
              setShowPanelID("");
            } else {
              setShowPanelID(value.id);
            }
          }}
        >
          {value.icon}
        </AsideItem>
      </Tooltip>
    );
  });

  return (
    <>
      {showItem ? (
        <PanelContainer style={{ borderLeft: "1px solid #d9d9d9" }}>
          <Item selectID={showPanelID} items={items} />
        </PanelContainer>
      ) : (
        <></>
      )}
      <Aside style={{ borderLeft: "1px solid #d9d9d9" }}>{sidebarItems}</Aside>
    </>
  );
};

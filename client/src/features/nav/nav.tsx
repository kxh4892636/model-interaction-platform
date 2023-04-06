/*
 * @Author: xiaohan kong
 * @Date: 2023-02-10
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-02-10
 * @Description: sidebar component
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import styled from "styled-components/macro";
import { useState } from "react";
import { message, Tooltip } from "antd";
import { NavItem } from "./types";
import { useNavigate, useRoutes } from "react-router-dom";
import useMapStore from "../../stores/map_store";
import useLayersStatusStore from "../../stores/layers_status_store";
import usePopupStore from "../../stores/popup_store";
import useProjectStatusStore from "../../stores/project_status_store";

// aside style
const Aside = styled.aside`
  display: flex;
  flex-direction: column;
  width: 60px;
  background: ${(props) => (props.theme === "black" ? "#434343" : "#fff")};
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
    background: ${(props) => (props.theme === "black" ? "#262626" : "#f0f0f0")};
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

const createRoutes = (items: NavItem[]) => {
  return items.map((item) => {
    return { path: `/${item.id}`, element: item.panel };
  });
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
type Position = "left" | "right";
type Theme = "black" | "white";
type AppProps = {
  items: NavItem[];
  position?: Position;
  theme?: Theme;
};
const Nav = ({ items, position = "left", theme = "black" }: AppProps) => {
  const navigate = useNavigate();
  const element = useRoutes([...createRoutes(items), { path: "/", element: <></> }]);
  const popupTag = usePopupStore((state) => state.popupTagStore);
  const setModelPopupTag = usePopupStore((state) => state.setModelPopupTag);
  const setModelPopup = usePopupStore((state) => state.setModelPopup);
  const removeModelPopup = usePopupStore((state) => state.removeModelPopup);
  const [showPanelID, setShowPanelID] = useState("");
  const [showItem, setShowItem] = useState(false);
  const map = useMapStore((state) => state.map);
  const layerChecked = useLayersStatusStore((state) => state.layersChecked);
  const projKey = useProjectStatusStore((state) => state.key);
  const setProjKey = useProjectStatusStore((state) => state.setKey);

  const NavItems = items.map((value): JSX.Element => {
    return (
      <Tooltip placement="right" title={value.title} key={crypto.randomUUID()}>
        <AsideItem
          theme={theme}
          onClick={(e) => {
            // TODO 这里写的太乱了, 我也不想改, 讲究着用吧
            if (projKey === "") {
              setProjKey("init");
              message.success("创建空白项目完成");
            } else;
            if (value.type === "view") {
              setModelPopupTag(!popupTag.model);
              setShowItem(false);
              setShowPanelID(value.id);
              if (popupTag.model === false) {
                setModelPopup(items.filter((item) => item.type === "view")[0].panel);
                layerChecked.forEach((key) => {
                  if (map!.getLayer(key)) map!.setLayoutProperty(key, "visibility", "none");
                  else;
                });
                navigate(`/${value.id}`);
              } else {
                layerChecked.forEach((key) => {
                  if (map!.getLayer(key)) map!.setLayoutProperty(key, "visibility", "visible");
                  else;
                });
                removeModelPopup();
                navigate("/");
              }
            } else {
              setModelPopupTag(false);
              if (showItem && value.id !== showPanelID) {
                navigate(`/${value.id}`);
              } else if (showItem) {
                navigate("/");
                setShowItem(!showItem);
              } else {
                navigate(`/${value.id}`);
                setShowItem(!showItem);
              }
              if (showPanelID === value.id) {
                setShowPanelID("");
              } else {
                setShowPanelID(value.id);
              }
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
      {showItem && position === "right" ? (
        <PanelContainer style={{ borderLeft: "1px solid #d9d9d9" }}>
          {/* <Item selectID={showPanelID} items={items} /> */}
          {element}
        </PanelContainer>
      ) : (
        <></>
      )}
      <Aside
        theme={theme}
        style={
          position === "left"
            ? { borderRight: "1px solid #d9d9d9" }
            : { borderLeft: "1px solid #d9d9d9" }
        }
      >
        {NavItems}
      </Aside>
      {showItem && position === "left" ? (
        <PanelContainer style={{ borderRight: "1px solid #d9d9d9" }}>
          {/* <Item selectID={showPanelID} items={items} /> */}
          {element}
        </PanelContainer>
      ) : (
        <></>
      )}
    </>
  );
};

export default Nav;

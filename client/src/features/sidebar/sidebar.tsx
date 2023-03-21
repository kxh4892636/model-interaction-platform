/*
 * @Author: xiaohan kong
 * @Date: 2023-02-10
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-03-15
 * @Description: sidebar component
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import styled from "styled-components/macro";
import { useState } from "react";
import { Tooltip } from "antd";
import { SidebarItem } from "./types";
import { ExchangeFlag } from "../../stores/model";
import { Route, Routes, useNavigate } from "react-router-dom";
import useMapStore from "../../stores/map_store";
import useLayersStatusStore from "../../stores/layers_status_store";

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
  width: 340px;
  background: #fff;
`;

type Position = "left" | "right";
type Theme = "black" | "white";
type AppProps = {
  items: SidebarItem[];
  position?: Position;
  theme?: Theme;
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
const Sidebar = ({ items, position = "left", theme = "black" }: AppProps) => {
  const [showItem, setShowItem] = useState(false);
  const sidebarItems = useSidebarItems(items, showItem, setShowItem);

  return (
    <>
      {showItem && position === "right" ? (
        // TODO react html props
        <PanelContainer style={{ borderLeft: "1px solid #d9d9d9" }}>
          <Routes>
            {items
              .filter((item) => item.path !== "model")
              .map((item) => {
                return <Route key={item.path} path={item.path} element={item.panel}></Route>;
              })}
          </Routes>
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
        {sidebarItems}
      </Aside>
      {showItem && position === "left" ? (
        <PanelContainer style={{ borderRight: "1px solid #d9d9d9" }}>
          <Routes>
            {items
              .filter((item) => item.path !== "model")
              .map((item) => {
                return <Route key={item.path} path={item.path} element={item.panel}></Route>;
              })}
          </Routes>
        </PanelContainer>
      ) : (
        <></>
      )}
    </>
  );
};

const useSidebarItems = (
  items: SidebarItem[],
  showItem: boolean,
  setShowItem: React.Dispatch<React.SetStateAction<boolean>>,
  theme: string = "black"
) => {
  const map = useMapStore((state) => state.map);
  const layerChecked = useLayersStatusStore((state) => state.layersChecked);
  const navigate = useNavigate();
  const [showPanelID, setShowPanelID] = useState("");
  const Flag = ExchangeFlag((state) => state.Flag);
  const setFlag = ExchangeFlag((state) => state.setFlag);
  const sidebarItems = items.map((value): JSX.Element => {
    // NOTE route
    return (
      <Tooltip placement="right" title={value.title} key={crypto.randomUUID()}>
        <AsideItem
          id={value.path}
          theme={theme}
          onClick={(e) => {
            // model模块大切换
            if (e.currentTarget.id === "model") {
              setFlag(Flag);
              if (Flag === false) {
                layerChecked.forEach((key) => {
                  if (map!.getLayer(key)) map!.setLayoutProperty(key, "visibility", "none");
                  else;
                });
                navigate("/model/EWEfish");
              } else {
                layerChecked.forEach((key) => {
                  if (map!.getLayer(key)) map!.setLayoutProperty(key, "visibility", "visible");
                  else;
                });
                navigate("/");
              }
            } else {
              if (!showItem) {
                navigate(`${value.path}`);
                setShowItem(!showItem);
              } else if (e.currentTarget.id !== showPanelID) {
                navigate(`${value.path}`);
              } else {
                setShowItem(!showItem);
                navigate(``);
              }
              if (showPanelID === e.currentTarget.id) {
                setShowPanelID("");
              } else {
                setShowPanelID(e.currentTarget.id);
              }
            }
          }}
        >
          {value.icon}
        </AsideItem>
      </Tooltip>
    );
  });

  return sidebarItems;
};

export default Sidebar;

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
import { Tooltip } from "antd";
import { NavItemType } from "./types";
import { useNavigate, useRoutes } from "react-router-dom";
import { useMapStore } from "../../stores/map_store";
import { useLayersStatusStore } from "../../stores/layers_status_store";
import { useViewStore } from "../../stores/view_store";
import { useProjectStatusStore } from "../../stores";
import modelRoute from "../model/route";

// nav style
const StyledNav = styled.nav`
  border-right: 1px solid #d9d9d9;
  background: #434343;
  display: flex;
  flex-direction: column;
  width: 60px;
`;
// nav item style
// NOTE
const NavItem = styled.div<{ position: string | undefined }>`
  margin-top: ${(props) => props.position && "auto"};
  padding: 14px 0;
  height: auto;
  border-radius: 0;
  border-color: rgba(0, 0, 0, 0);
  color: #8c8c8c;
  background: rgba(0, 0, 0, 0);
  text-align: center;
  &&:hover {
    background: "#262626";
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

const createRoutes = (items: NavItemType[]) => {
  return [
    ...items.map((item) => {
      return { path: `/${item.id}`, element: item.panel };
    }),
    ...modelRoute,
  ];
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
type NavProps = {
  items: NavItemType[];
};
export const Nav = ({ items }: NavProps) => {
  const navigate = useNavigate();
  const element = useRoutes([...createRoutes(items), { path: "/", element: <></> }]);
  const viewTag = useViewStore((state) => state.viewTag);
  const setView = useViewStore((state) => state.setView);
  const setViewTag = useViewStore((state) => state.setViewTag);
  const [showPanelID, setShowPanelID] = useState("");
  const [showItem, setShowItem] = useState(false);
  const map = useMapStore((state) => state.map);
  const layerChecked = useLayersStatusStore((state) => state.layersChecked);
  const projectKey = useProjectStatusStore((state) => state.key);

  const NavItems = items.map((value): JSX.Element => {
    return (
      <Tooltip placement="right" title={value.title} key={value.id}>
        <NavItem
          position={value.position}
          onClick={() => {
            if (!projectKey.includes("-")) return;
            else;
            if (value.type === "view") {
              // navigate project and model panel
              setShowItem(false);
              setView(items.filter((item) => item.id === value.id)[0].panel);
              if (viewTag && value.id !== showPanelID) {
                layerChecked["map"].forEach((key) => {
                  if (map!.getLayer(key)) map!.setLayoutProperty(key, "visibility", "none");
                  else;
                });
                navigate(`/${value.id}`);
              } else {
                layerChecked["map"].forEach((key) => {
                  if (map!.getLayer(key)) map!.setLayoutProperty(key, "visibility", "visible");
                  else;
                });
                navigate(viewTag ? "/" : `/${value.id}`);
                setViewTag(!viewTag);
              }
            } // navigate other panel
            else {
              setViewTag(false);
              // navigate logical
              if (showItem && value.id !== showPanelID) {
                navigate(`/${value.id}`);
              } else {
                navigate(showItem ? "/" : `/${value.id}`);
                setShowItem(!showItem);
              }
            }
            // set new panel id
            if (showPanelID === value.id) {
              setShowPanelID("");
            } else {
              setShowPanelID(value.id);
            }
          }}
        >
          {value.icon}
        </NavItem>
      </Tooltip>
    );
  });

  return (
    <>
      <StyledNav>{NavItems}</StyledNav>
      {showItem ? (
        <PanelContainer style={{ borderRight: "1px solid #d9d9d9" }}>{element}</PanelContainer>
      ) : (
        <></>
      )}
    </>
  );
};

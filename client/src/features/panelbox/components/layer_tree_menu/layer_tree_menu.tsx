/*
 * @File: LayerTreeMenu component
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-02-16
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { LayerMenuItem } from "../../types/index";

/**
 * @description LayerTreeMenu
 * @module LayerTreeMenu
 * @Author xiaohan kong
 * @param layerMenuItems LayerMenuItem[]
 * @export module: LayerTreeMenu
 */
const LayerTreeMenu: React.FC<{ layerMenuItems: LayerMenuItem[] }> = ({ layerMenuItems }) => {
  // transform layerMenuItems to antd MenuPorps['items']
  const createItems = (layerMenuItems: LayerMenuItem[]) => {
    let array: MenuProps["items"] = [];
    layerMenuItems.forEach((value) => {
      array!.push({ key: value.key, label: value.label });
    });
    return array;
  };
  const items = createItems(layerMenuItems);

  return (
    <Dropdown
      menu={{
        items,
        onClick: (e) => {
          layerMenuItems.forEach((value) => {
            if (value.key === e.key) {
              value.action();
            }
          });
        },
      }}
      trigger={["click"]}
    >
      <EllipsisOutlined />
    </Dropdown>
  );
};

export default LayerTreeMenu;

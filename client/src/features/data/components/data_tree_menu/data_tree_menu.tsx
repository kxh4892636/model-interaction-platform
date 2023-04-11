/*
 * @File: data_tree_menu
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-09
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { DataTreeMenuType } from "../../types";

/**
 * @description DataTreeMenu
 * @module DataTreeMenu
 * @Author xiaohan kong
 * @param layerMenuItems DataTreeMenu[]
 * @export module: DataTreeMenu
 */
export const DataTreeMenu: React.FC<{ layerMenuItems: DataTreeMenuType[] }> = ({
  layerMenuItems,
}) => {
  // transform layerMenuItems to antd MenuPorps['items']
  const createItems = (layerMenuItems: DataTreeMenuType[]) => {
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

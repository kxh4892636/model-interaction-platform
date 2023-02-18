/*
 * @File: DataPanel component
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-02-16
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import styled from "styled-components";
import axios from "axios";
import { Input } from "antd";
import { useEffect, useState } from "react";
import {
  PanelContainer,
  PanelContentContainer,
  PanelTitleContainer,
  PanelToolsContainer,
  PanelToolContainer,
} from "./components/panel_layout";
import DataList from "./components/data_list";
import DataDetailPage from "./components/data_detail_page";
import { DataListData } from "./types";

// modify style of antd search component
const { Search } = Input;
const DataSearch = styled(Search)`
  padding: 0px 8px;
`;

type AppProps = { title: string; url: string };

/**
 * @description DataPanel components
 * @module DataPanel
 * @author xiaohan kong
 * @param title title of DataPanel
 * @param data data of DataList
 * @export module: DataPanel
 */
const DataPanel = ({ title, url }: AppProps) => {
  const [showDetail, setShowDetail] = useState(false);
  const [selectedItem, setselectedItem] = useState("");
  // NOTE
  const [data, setData] = useState<DataListData[]>([]);

  useEffect(() => {
    axios.get("http://localhost:3456" + url).then((res) => {
      const data = (res.data as { [props: string]: any }[]).map((value) => {
        return { key: value.id, title: value.title, image: value.image, author: value.author };
      });

      setData(data);
    });
  }, [url]);

  return (
    <PanelContainer>
      {showDetail ? (
        <DataDetailPage url={"/data/data?id=" + selectedItem} setShowDetail={setShowDetail} />
      ) : (
        <></>
      )}
      <PanelTitleContainer>{title}</PanelTitleContainer>
      <PanelToolsContainer>
        <PanelToolContainer>
          <DataSearch
            placeholder="input search text"
            // TODO 方法要加
            onSearch={() => {}}
          />
        </PanelToolContainer>
      </PanelToolsContainer>
      <PanelToolsContainer>占位符, 此处为筛选功能</PanelToolsContainer>
      <PanelContentContainer>
        <DataList
          data={data}
          setShowDetail={setShowDetail}
          setselectedItem={setselectedItem}
        ></DataList>
      </PanelContentContainer>
    </PanelContainer>
  );
};

export default DataPanel;

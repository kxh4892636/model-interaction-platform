/*
 * @File: CasePanel component
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-02-23
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import styled from "styled-components/macro";
import axios from "axios";
import { Input } from "antd";
import { useEffect, useState } from "react";
import {
  PanelContainer,
  PanelContentContainer,
  PanelTitleContainer,
  PanelToolsContainer,
  PanelToolContainer,
} from "../../components/layout";
import CaseList from "./components/case_list";
import CasePage from "./components/case_detail_page";
import { CaseListData } from "./types";

// modify style of antd search component
const { Search } = Input;
const CaseSearch = styled(Search)`
  padding: 0 8px;
`;

/**
 * @description CasePanel components
 * @module CasePanel
 * @author xiaohan kong
 * @param the url that get case list
 * @export module: CasePanel
 */
const CasePanel = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [selectedItem, setselectedItem] = useState("s");
  const [data, setData] = useState<CaseListData[]>([]);

  useEffect(() => {
    axios.get("http://localhost:3456/case/list").then((res) => {
      const data = (res.data as { [props: string]: any }[]).map((value) => {
        return {
          key: value.id,
          title: value.title,
          image: value.image,
          author: value.author,
          data: value.data,
        };
      });
      setData(data);
    });
  }, []);

  return (
    <PanelContainer>
      {showDetail ? (
        <CasePage
          id={selectedItem}
          onClose={() => {
            setShowDetail(false);
          }}
        />
      ) : (
        <></>
      )}
      <PanelTitleContainer>项目面板</PanelTitleContainer>
      <PanelToolsContainer>
        <PanelToolContainer>
          <CaseSearch
            placeholder="input search text"
            // TODO 方法要加
            onSearch={() => {}}
          />
        </PanelToolContainer>
      </PanelToolsContainer>
      <PanelToolsContainer>占位符, 此处为筛选功能</PanelToolsContainer>
      <PanelContentContainer>
        <CaseList
          data={data}
          onShow={(id) => {
            setselectedItem(id);
            setShowDetail(true);
          }}
        ></CaseList>
      </PanelContentContainer>
    </PanelContainer>
  );
};

export default CasePanel;

/*
 * @File: CaseDetailPage component
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-02-20
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import { CloseOutlined } from "@ant-design/icons";
import { Button } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { ServerCase, ServerData } from "../../../../types";
import { useData } from "../../../../hooks";

// CaseDetailPage Container sytle
const CaseDetailContainer = styled.div`
  position: absolute;
  height: 94vh;
  width: 340px;
  background-color: #fff;
  z-index: 9;
`;
// CaseDetailPage title container
const CaseDetailTitleContainer = styled.div`
  height: 5vh;
  line-height: 5vh;
  font-size: 18px;
  font-weight: bold;
  padding: 0px 12px;
`;
// CaseDetailPage close symbol style
const StyledCloseOutlined = styled(CloseOutlined)`
  position: absolute;
  top: 10px;
  right: 4px;
  font-size: 18px;
  padding: 6px;
  :hover {
    background: #f0f0f0;
  }
`;
// CaseDetailPage Image container
const CaseDetailImageContainer = styled.div`
  height: 25vh;
  border-bottom: 1px solid #d9d9d9;
  border-top: 1px solid #d9d9d9;
  .view {
    height: 100%;
    width: 100%;
    padding: 8px;
    outline: 1px solid #d9d9d9;
    outline-offset: -8px;
  }
`;
// CaseDetailPage tags container
const CaseDetailTagsContainer = styled.div`
  height: 4vh;
  border-bottom: 1px solid #d9d9d9;
`;
// CaseDetailPage meta container
const CaseDetailMetaContainer = styled.div`
  height: 4vh;
  border-bottom: 1px solid #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
`;
// CaseDetailPage description container
const CaseDetailDescriptionContainer = styled.div`
  height: 51vh;
  border-bottom: 1px solid #d9d9d9;
`;

const CaseDetailDataActionContainer = styled.div`
  height: 5vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

type AppProps = {
  url: string;
  onClose: () => void;
};

/**
 * @description CaseDetailPage
 * @module CaseDetailPage
 * @Author xiaohan kong
 * @param data data
 * @param setShowDetail click event for the top left close symbol, close CaseDetailPage component
 * @export module: CaseDetailPage
 */
const CaseDetailPage = ({ url, onClose }: AppProps) => {
  const [data, setData] = useState<ServerCase>();
  const addData = useData("add");

  useEffect(() => {
    axios.get("http://localhost:3456" + url).then((res) => {
      if (typeof res.data === "object") setData(res.data);
    });
  }, [url]);

  return data ? (
    <CaseDetailContainer>
      <CaseDetailTitleContainer>{data.title}</CaseDetailTitleContainer>
      <StyledCloseOutlined onClick={onClose} />
      <CaseDetailImageContainer>
        <img alt="view" className="view" src={data.image} />
      </CaseDetailImageContainer>
      <CaseDetailTagsContainer>{data.tags}</CaseDetailTagsContainer>
      <CaseDetailMetaContainer>
        <div style={{ marginInlineEnd: "auto", paddingInlineStart: "10px" }}>
          作者: {data.author}
        </div>
        <div style={{ paddingInlineEnd: "10px" }}>上传时间: {data.time.split("T")[0]}</div>
      </CaseDetailMetaContainer>
      <CaseDetailDescriptionContainer>{data.description}</CaseDetailDescriptionContainer>
      <CaseDetailDataActionContainer>
        <Button
          type="primary"
          style={{ marginInlineStart: "auto", marginInlineEnd: "10px" }}
          onClick={() => {
            data.data.forEach((id) => {
              axios.get("http://localhost:3456/data/detail?id=" + id).then((res) => {
                const data: ServerData = res.data;
                addData(data.id);
              });
            });
          }}
        >
          添加至地图
        </Button>
      </CaseDetailDataActionContainer>
    </CaseDetailContainer>
  ) : (
    <></>
  );
};

export default CaseDetailPage;

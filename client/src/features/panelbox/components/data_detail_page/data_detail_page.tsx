/*
 * @File: DataDetailPage component
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-02-16
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import { CloseOutlined } from "@ant-design/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { DataDetailData } from "../../types";

// DataDetailPage Container sytle
const DataDetailContainer = styled.div`
  position: absolute;
  height: 94vh;
  width: 340px;
  background-color: #fff;
  z-index: 9;
`;
// DataDetailPage title container
const DataDetailTitle = styled.div`
  height: 5vh;
  line-height: 5vh;
  font-size: 18px;
  font-weight: bold;
  padding: 0px 12px;
`;
// DataDetailPage close symbol style
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
// DataDetailPage Image container
const DataDetailImage = styled.div`
  height: 25vh;
  border-bottom: 1px solid #d9d9d9;
  border-top: 1px solid #d9d9d9;
`;
// DataDetailPage tag container
const DataDetailTag = styled.div`
  height: 4vh;
  border-bottom: 1px solid #d9d9d9;
`;
// DataDetailPage meta container
const DataDetailMeta = styled.div`
  height: 4vh;
  border-bottom: 1px solid #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
`;
// DataDetailPage description container
const DataDetailDescription = styled.div`
  height: 56vh;
`;

type AppProps = {
  url: string;
  setShowDetail: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * @description DataDetailPage
 * @module DataDetailPage
 * @Author xiaohan kong
 * @param data data
 * @param setShowDetail click event for the top left close symbol, clese DetailDataPage component
 * @export module: DataDetailPage
 */
const DataDetailPage = ({ url, setShowDetail }: AppProps) => {
  const [data, setData] = useState<DataDetailData>();

  useEffect(() => {
    axios.get("http://localhost:3456" + url).then((res) => {
      setData(res.data);
      console.log("kxh");
    });
  }, [url]);

  return data ? (
    <DataDetailContainer>
      <DataDetailTitle>{data.title}</DataDetailTitle>
      <StyledCloseOutlined onClick={() => setShowDetail(false)} />
      <DataDetailImage>{data.title}</DataDetailImage>
      <DataDetailTag>{data.tags}</DataDetailTag>
      <DataDetailMeta>
        <div style={{ marginInlineEnd: "auto", paddingInlineStart: "10px" }}>
          作者: {data.author}
        </div>
        <div style={{ paddingInlineEnd: "10px" }}>上传时间: {data.time.split("T")[0]}</div>
      </DataDetailMeta>
      <DataDetailDescription>{data.description}</DataDetailDescription>
    </DataDetailContainer>
  ) : (
    <></>
  );
};

export default DataDetailPage;

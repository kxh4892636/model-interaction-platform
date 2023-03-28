/*
 * @File: CasePage component
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-03-22
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import { CloseOutlined } from "@ant-design/icons";
import { Button, message, Tag } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components/macro";
import useData from "../../../../hooks/use_data";
import { ServerCase } from "../../../../types";
import useCase from "../../hooks/use_case";

// CasePage Container sytle
const CaseContainer = styled.div`
  display: flex;
  flex-flow: column;
  position: absolute;
  width: 340px;
  height: 100%;
  background-color: #fff;
  z-index: 9;
`;
// CasePage title container
const CaseTitleContainer = styled.div`
  height: 48px;
  line-height: 48px;
  font-size: 18px;
  font-weight: bold;
  padding: 0 12px;
`;
// CasePage close symbol style
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
// CasePage Image container
const CaseImageContainer = styled.div`
  height: 255px;
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
// CasePage tags container
const CaseTagsContainer = styled.div`
  height: 40px;
  border-bottom: 1px solid #d9d9d9;
  display: flex;
  align-items: center;
`;
// CasePage meta container
const CaseMetaContainer = styled.div`
  height: 40px;
  border-bottom: 1px solid #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
`;
// CasePage description container
const CaseDescriptionContainer = styled.div`
  flex: 1 1 0;
  border-bottom: 1px solid #d9d9d9;
  padding: 10px;
`;

const CaseDataActionContainer = styled.div`
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

type AppProps = {
  id: string;
  onClose: () => void;
};

/**
 * @description CasePage
 * @module CasePage
 * @Author xiaohan kong
 * @param id data id
 * @param onClose click event for the top left close symbol, close CasePage component
 * @export module: CasePage
 */
const CasePage = ({ id, onClose }: AppProps) => {
  const [data, setData] = useState<ServerCase>();
  const caseActions = useCase();
  const [imageUrl, setImageUrl] = useState<string>();
  const dataAction = useData();

  const createTags = (tags: string[]) => {
    let color = ["magenta", "volcano", "blue", "purple"];
    const tagsElement = tags.map((tag) => {
      const tag2Name = {
        data: "数据集",
        example: "示例集",
        hydrodynamics: "水动力模型",
        ecopath: "Ecopath 模型",
      };

      return (
        <Tag
          key={tag}
          style={{ margin: "0px 6px", fontSize: "14px", lineHeight: "28px", height: "28px" }}
          color={color.pop()}
        >
          {(tag2Name as any)[tag]}
        </Tag>
      );
    });
    return tagsElement;
  };

  useEffect(() => {
    axios.get("http://localhost:3456/case/case?id=" + id).then((res) => {
      if (typeof res.data === "object") setData(res.data);
      else;
      dataAction.getData(res.data.image, "image", {}, "blob").then((res) => {
        const blob = new Blob([res]);
        const url = window.URL.createObjectURL(blob);
        setImageUrl(url);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return data ? (
    <CaseContainer>
      <CaseTitleContainer>{data.title}</CaseTitleContainer>
      <StyledCloseOutlined onClick={onClose} />
      <CaseImageContainer>
        <img alt="view" className="view" src={imageUrl} />
      </CaseImageContainer>
      <CaseTagsContainer>{createTags(data.tags)}</CaseTagsContainer>
      <CaseMetaContainer>
        <div style={{ marginInlineEnd: "auto", paddingInlineStart: "10px" }}>
          作者: {data.author}
        </div>
        <div style={{ paddingInlineEnd: "10px" }}>上传时间: {data.time.split("T")[0]}</div>
      </CaseMetaContainer>
      <CaseDescriptionContainer>{data.description}</CaseDescriptionContainer>
      <CaseDataActionContainer>
        <Button
          type="primary"
          style={{ marginInlineStart: "auto", marginInlineEnd: "10px", fontSize: "14px" }}
          onClick={async () => {
            await caseActions.addCase(id);
            message.success("加载项目完成");
          }}
        >
          添加至地图
        </Button>
      </CaseDataActionContainer>
    </CaseContainer>
  ) : (
    <></>
  );
};

export default CasePage;

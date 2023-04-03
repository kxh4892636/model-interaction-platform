/*
 * @File: project
 * @Author: xiaohan kong
 * @Date: 2023-04-03
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-03
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import styled from "styled-components/macro";
import useCase from "../case/hooks/use_case";
import { Button, Card, message, Space } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { ServerProject } from "../../types";
import { useData } from "../../hooks";
import { CaseListData } from "../case/types";
import usePopupStore from "../../stores/popup_store";
import useProjectStatusStore from "../../stores/project_status_store";

const { Meta } = Card;
const ProjectViewContainer = styled.div`
  position: relative;
  height: 91vh;
  background: #fff;
  z-index: 10;
  display: flex;
  flex-flow: column;
`;
const ProjectViewTitle = styled.div`
  height: 48px;
  line-height: 48px;
  font-size: 16px;
  padding: 0px 12px;
  border-bottom: 1px solid #d9d9d9;
`;

const ProjectViewContentContainer = styled.div`
  flex: 1 1 0;
  background: #fff;
  z-index: 10;
  display: flex;
  padding: 12px;
`;

const CardListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  grid-gap: 30px;
  justify-items: center;
  background: #fff;
  z-index: 10;
  margin: 30px 80px;
  padding: 30px 20px;
  height: 76vh;
  width: 100%;
  overflow: auto;
  border: 1px solid #bfbfbf;
  border-radius: 10px;
`;

/**
 * @description generate card list
 * @module cardList
 * @author xiaohan kong
 * @export module: cardList
 * @param cardListData the data fo cardList
 * @param caseActions useCase hook
 */
const CardList = ({ dataList }: { dataList: CaseListData[] }) => {
  const setModelPopupTag = usePopupStore((state) => state.setModelPopupTag);

  const handleCreate = () => {
    setModelPopupTag(false);
    message.success("创建空白项目完成");
  };

  const cardList = dataList.map((data) => (
    <Card
      style={{ flex: "1 1 0", width: "240px", maxHeight: "320px" }}
      cover={<img alt="cover" src={data.image} width={210} height={180} />}
      key={data.key}
      size={"small"}
      actions={[
        <Button
          danger
          type="primary"
          size="small"
          onClick={() => {}}
          style={{ marginLeft: "auto" }}
        >
          删除该项目
        </Button>,
        <Button type="primary" size="small" onClick={() => {}} style={{ marginLeft: "auto" }}>
          加载该项目
        </Button>,
      ]}
    >
      <Meta title={data.title} description={`作者:${data.author}`} />
    </Card>
  ));

  return (
    <CardListContainer>
      <Card
        style={{ flex: "1 1 0", width: "240px", maxHeight: "320px" }}
        cover={
          <img
            alt="cover"
            src={process.env.PUBLIC_URL + "/new_project.png"}
            width={210}
            height={180}
          />
        }
        key={"new"}
        size={"small"}
        actions={[
          <Button
            id="new"
            type="primary"
            size="small"
            onClick={() => {
              handleCreate();
            }}
            style={{ marginLeft: "auto" }}
          >
            创建新项目
          </Button>,
        ]}
      >
        <Meta title={"空白项目"} description={`作者: `} />
      </Card>
      {cardList}
    </CardListContainer>
  );
};

/**
 * @description project page
 * @module ProjectView
 * @author xiahan kong
 * @export module: ProjectView
 */
const ProjectView = () => {
  const [selectedItem, setSelectedItem] = useState("");
  const [data, setData] = useState<CaseListData[]>([]);
  const dataAction = useData();

  const getImageUrl = async (key: string | undefined) => {
    if (!key) {
      return "http://localhost:3333/no_data.png";
    } else {
      const image = await dataAction.getData(key, "image", {}, "blob");
      const blob = new Blob([image]);
      const url = window.URL.createObjectURL(blob);
      return url;
    }
  };

  useEffect(() => {
    axios.get("http://localhost:3456/project/list").then(async (res) => {
      const result: ServerProject[] = res.data;
      let projectListData: CaseListData[] = [];
      for (let index = 0; index < result.length; index++) {
        const item = result[index];
        const imageUrl = await getImageUrl(item.image);
        projectListData.push({
          key: item.id,
          title: item.title,
          image: imageUrl,
          author: item.author,
          data: item.data,
        });
      }
      setData(projectListData);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProjectViewContainer>
      <ProjectViewTitle>项目列表</ProjectViewTitle>
      <ProjectViewContentContainer>
        <CardList dataList={data}></CardList>
      </ProjectViewContentContainer>
    </ProjectViewContainer>
  );
};

export default ProjectView;

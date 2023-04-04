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
import { Button, Card, message, Popconfirm, Space } from "antd";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ServerProject } from "../../types";
import { useData } from "../../hooks";
import { ProjectListData } from "./types";
import usePopupStore from "../../stores/popup_store";
import useProjectStatusStore from "../../stores/project_status_store";
import useMapStore from "../../stores/map_store";
import { randomInt } from "crypto";
import useInit from "../../hooks/use_init";

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
const CardList = ({
  dataList,
  setIsRefresh,
}: {
  dataList: ProjectListData[];
  setIsRefresh: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const setModelPopupTag = usePopupStore((state) => state.setModelPopupTag);
  const setProjectKey = useProjectStatusStore((state) => state.setKey);
  const projectKey = useProjectStatusStore((state) => state.key);
  const map = useMapStore((state) => state.map);
  const initAction = useInit();

  const handleCreate = () => {
    initAction.clearStoreDataExcludeMapAndProject();
    setModelPopupTag(false);
    setProjectKey("init");
    map!.setCenter([116.3916, 39.9079]);
    map!.setZoom(11);
    message.success("创建空白项目完成");
  };

  const cardList = dataList.map((data) => (
    <Card
      style={{ flex: "1 1 0", width: "240px", maxHeight: "310px" }}
      cover={<img alt="cover" src={data.image} width={210} height={180} />}
      key={data.key}
      size={"small"}
      actions={[
        <Popconfirm
          title="删除项目"
          description="你是否确定删除该项目?"
          onConfirm={() => {
            axios
              .request({
                url: "http://localhost:3456/project/action",
                method: "post",
                data: {
                  action: "delete",
                  id: data.key,
                },
              })
              .then((res) => {
                const result = res.data;
                if (result.status === "success") {
                  setIsRefresh(Math.floor(Math.random() * 1000));
                  message.success("删除项目完成");
                } else {
                  message.error("删除项目失败");
                }
              });
          }}
          okText="确定删除"
          cancelText="取消删除"
        >
          <Button
            type="primary"
            danger
            style={{ marginInlineEnd: "auto", marginInlineStart: "10px", fontSize: "14px" }}
          >
            删除项目
          </Button>
        </Popconfirm>,
        projectKey !== "" ? (
          <Popconfirm
            title="加载项目"
            description="已存在项目, 加载该项目将取消目前一切操作?"
            onConfirm={() => {
              initAction.clearStoreDataExcludeMapAndProject();
              setProjectKey(data.key);
              setModelPopupTag(false);
              map!.setCenter([Number(data.position[0]), Number(data.position[1])]);
              map!.setZoom(Number(data.position[2]));
              message.success("加载项目完成");
            }}
            okText="确定加载"
            cancelText="取消加载"
          >
            <Button type="primary" style={{ marginLeft: "auto" }}>
              加载项目
            </Button>
          </Popconfirm>
        ) : (
          <Button
            type="primary"
            onClick={() => {
              initAction.clearStoreDataExcludeMapAndProject();
              setProjectKey(data.key);
              setModelPopupTag(false);
              map!.setCenter([Number(data.position[0]), Number(data.position[1])]);
              map!.setZoom(Number(data.position[2]));
              message.success("加载项目完成");
            }}
            style={{ marginLeft: "auto" }}
          >
            加载项目
          </Button>
        ),
      ]}
    >
      <Meta title={data.title} description={`作者:${data.author}`} />
    </Card>
  ));

  return (
    <CardListContainer>
      <Card
        style={{ flex: "1 1 0", width: "240px", maxHeight: "310px" }}
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
          projectKey !== "" ? (
            <Popconfirm
              title="创建空白项目"
              description="已存在项目, 创建该项目将取消目前一切操作?"
              onConfirm={() => {
                handleCreate();
              }}
              okText="确定创建"
              cancelText="取消创建"
            >
              <Button id="new" type="primary" style={{ marginLeft: "auto" }}>
                创建空白项目
              </Button>
            </Popconfirm>
          ) : (
            <Button
              id="new"
              type="primary"
              onClick={() => {
                handleCreate();
              }}
              style={{ marginLeft: "auto" }}
            >
              创建空白项目
            </Button>
          ),
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
  const [data, setData] = useState<ProjectListData[]>([]);
  const [isRefresh, setIsRefresh] = useState(0);
  const dataAction = useData();

  const getImageUrl = async (key: string) => {
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
      const result: ServerProject[] = res.data.content;
      let projectListData: ProjectListData[] = [];
      for (let index = 0; index < result.length; index++) {
        const item = result[index];
        const imageUrl = await getImageUrl(item.image);
        projectListData.push({
          key: item.id,
          title: item.title,
          image: imageUrl,
          author: item.author,
          data: item.data,
          position: item.position,
        });
      }
      setData(projectListData);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRefresh]);

  return (
    <ProjectViewContainer>
      <ProjectViewTitle>项目列表</ProjectViewTitle>
      <ProjectViewContentContainer>
        <CardList dataList={data} setIsRefresh={setIsRefresh}></CardList>
      </ProjectViewContentContainer>
    </ProjectViewContainer>
  );
};

export default ProjectView;

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
import { Button, Card, message, Popconfirm, Modal, Input, Space, Tag } from "antd";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ServerProject } from "../../types";
import { useData } from "../../hooks";
import { ProjectListData } from "./types";
import { useViewStore } from "../../stores/view_store";
import { useProjectStatusStore } from "../../stores/project_status_store";
import { useMapStore } from "../../stores/map_store";
import { useInit } from "../../hooks";
import { useLayersStore, useModalStore } from "../../stores";
import { useManualRefreshStore } from "../../stores/refresh_store";
import { serverHost } from "../../config/global_variable";

const { Meta } = Card;
const ProjectViewContainer = styled.div`
  position: relative;
  height: 94vh;
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

const TagsContainer = styled.div`
  width: 220px;
  overflow: scroll;
  white-space: nowrap;
  ::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
`;

const ProjectInfoModal = () => {
  const initAction = useInit();
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const setProjectKey = useProjectStatusStore((state) => state.setKey);
  const map = useMapStore((state) => state.map);
  const modalTag = useModalStore((state) => state.modalTag);
  const setModalTag = useModalStore((state) => state.setModalTag);
  const setModal = useModalStore((state) => state.setModal);

  return (
    <Modal
      title="创建空白项目"
      cancelText="取消"
      okText="确认"
      centered
      style={{ top: "-10vh" }}
      confirmLoading={isLoading}
      open={modalTag}
      onOk={async () => {
        if (inputValue === "") {
          message.error("请输入项目标题");
          return;
        } else;
        const result = await axios.request({
          url: serverHost + "/api/project/action",
          method: "post",
          data: {
            action: "create",
            title: inputValue,
          },
        });
        if (result.data.status === "success") {
          setProjectKey(result.data.content);
          map!.setCenter([116.3916, 39.9079]);
          map!.setZoom(11);
          initAction.clearStoreDataExcludeMapAndProject();
          message.success("创建空白项目完成");
        } else {
          message.error("创建空白项目失败");
        }
        setModalTag(false);
        setIsLoading(false);
        setModal(<></>);
      }}
      onCancel={() => {
        setModalTag(false);
        message.error("创建空白项目失败");
      }}
    >
      <Space direction="vertical" style={{ width: 380 }}>
        <div>项目标题</div>
        <Input
          placeholder="请输入项目标题"
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        />
      </Space>
    </Modal>
  );
};

/**
 * @description display tags of project
 * @module TagsPanel
 * @author xiaohan kong
 * @param tags tags data
 * @export module: TagsPanel
 */
const TagsPanel = ({ tags }: { tags: string[] }) => {
  const tagRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<number>(0);
  const colors = [
    "magenta",
    "red",
    "volcano",
    "orange",
    "gold",
    "lime",
    "green",
    "cyan",
    "blue",
    "geekblue",
    "purple",
  ];

  const autoScroll = () => {
    async function sleep(delay: number) {
      return new Promise((resolve) => setTimeout(resolve, delay));
    }
    const scroll = async () => {
      if (!tagRef.current) return;
      else;
      if (tagRef.current.scrollWidth <= tagRef.current.clientWidth) return;
      else;
      if (tagRef.current.scrollLeft + tagRef.current.clientWidth === tagRef.current.scrollWidth) {
        await sleep(500);
        tagRef.current.scrollLeft = 0;
        cancelAnimationFrame(intervalRef.current);
      } else if (tagRef.current.scrollLeft === 0) {
        await sleep(500);
        tagRef.current.scrollLeft += 1;
        cancelAnimationFrame(intervalRef.current);
      } else {
        tagRef.current.scrollLeft += 1;
      }
      intervalRef.current = requestAnimationFrame(scroll);
    };

    if (!tagRef.current) return;
    else;
    intervalRef.current = requestAnimationFrame(scroll);
    tagRef.current.onmousemove = () => {
      cancelAnimationFrame(intervalRef.current);
    };
    tagRef.current.onmouseenter = () => {
      cancelAnimationFrame(intervalRef.current);
    };
    tagRef.current.onmouseleave = () => {
      intervalRef.current = requestAnimationFrame(scroll);
    };
  };

  const element = tags.map((tag, index) => {
    const random = Math.floor(Math.random() * 10);

    return (
      <Tag key={index} color={colors[random]}>
        {tag}
      </Tag>
    );
  });

  useEffect(() => {
    autoScroll();
    return () => {
      cancelAnimationFrame(intervalRef.current);
    };
  }, []);

  return tags.length >= 1 ? (
    <TagsContainer ref={tagRef}>{element}</TagsContainer>
  ) : (
    <TagsContainer>
      <Tag>无标签</Tag>
    </TagsContainer>
  );
};

/**
 * @description generate card list
 * @module cardList
 * @author xiaohan kong
 * @export module: cardList
 * @param cardListData the data fo cardList
 * @param caseActions useCase hook
 */
const CardList = ({ dataList }: { dataList: ProjectListData[] }) => {
  const setViewTag = useViewStore((state) => state.setViewTag);
  const setProjectKey = useProjectStatusStore((state) => state.setKey);
  const projectKey = useProjectStatusStore((state) => state.key);
  const map = useMapStore((state) => state.map);
  const initAction = useInit();
  const setModal = useModalStore((state) => state.setModal);
  const modalTag = useModalStore((state) => state.modalTag);
  const setModalTag = useModalStore((state) => state.setModalTag);
  const manualRefresh = useManualRefreshStore((state) => state.manualRefresh);
  const setLayers = useLayersStore((state) => state.setLayers);

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
                url: serverHost + "/api/project/action",
                method: "post",
                data: {
                  action: "delete",
                  id: data.key,
                },
              })
              .then((res) => {
                const result = res.data;
                if (result.status === "success") {
                  message.success("删除项目完成");
                } else {
                  message.error("删除项目失败");
                }
                manualRefresh();
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
            onConfirm={async () => {
              initAction.clearStoreDataExcludeMapAndProject();
              await axios
                .request({
                  url: serverHost + "/api/project/project",
                  params: {
                    action: "layer",
                    id: data.key,
                  },
                })
                .then((res) => setLayers(res.data.content, "data"));
              setProjectKey(data.key);
              setViewTag(false);
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
            onClick={async () => {
              initAction.clearStoreDataExcludeMapAndProject();
              await axios
                .request({
                  url: serverHost + "/api/project/project",
                  params: {
                    action: "layer",
                    id: data.key,
                  },
                })
                .then((res) => setLayers(res.data.content, "data"));
              setProjectKey(data.key);
              setViewTag(false);
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
      <Meta title={data.title} description={<TagsPanel tags={data.tags}></TagsPanel>} />
    </Card>
  ));

  return (
    <>
      {modalTag ? <ProjectInfoModal /> : <></>}
      <CardListContainer>
        <Card
          style={{ width: "240px", maxHeight: "310px" }}
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
                  setModal(<ProjectInfoModal />);
                  setModalTag(true);
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
                  setModal(<ProjectInfoModal />);
                  setModalTag(true);
                }}
                style={{ marginLeft: "auto" }}
              >
                创建空白项目
              </Button>
            ),
          ]}
        >
          <Meta title={"空白项目"} description={<Tag>空白项目</Tag>} />
        </Card>
        {cardList}
      </CardListContainer>
    </>
  );
};

/**
 * @description project page
 * @module ProjectView
 * @author xiahan kong
 * @export module: ProjectView
 */
export const ProjectView = () => {
  const [data, setData] = useState<ProjectListData[]>([]);
  const dataAction = useData();
  const refreshTag = useManualRefreshStore((state) => state.refreshTag);

  const getImageUrl = async (key: string) => {
    if (!key) {
      return process.env.PUBLIC_URL + "/no_data.png";
    } else {
      const image = await dataAction.getData(key, "image", {}, "blob");
      const blob = new Blob([image]);
      const url = window.URL.createObjectURL(blob);
      return url;
    }
  };

  useEffect(() => {
    axios.get(serverHost + "/api/project/list").then(async (res) => {
      const result: ServerProject[] = res.data.content;
      let projectListData: ProjectListData[] = [];
      for (let index = 0; index < result.length; index++) {
        const item = result[index];
        const imageUrl = await getImageUrl(item.image);
        projectListData.push({
          key: item.id,
          title: item.title,
          image: imageUrl,
          data: item.data,
          position: item.position,
          tags: item.tags,
        });
      }
      setData(projectListData);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTag]);

  return (
    <ProjectViewContainer>
      <ProjectViewTitle>项目列表</ProjectViewTitle>
      <ProjectViewContentContainer>
        <CardList dataList={data}></CardList>
      </ProjectViewContentContainer>
    </ProjectViewContainer>
  );
};

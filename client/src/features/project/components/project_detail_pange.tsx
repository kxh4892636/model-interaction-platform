/*
 * @File: ProjectPage component
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-03-22
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import { Tag } from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components/macro";
import { ServerProject } from "../../../types";
import { useData } from "../../../hooks";

// ProjectPage Container sytle
const ProjectContainer = styled.div`
  display: flex;
  flex-flow: column;
  width: 360px;
  background-color: #fff;
  z-index: 9;
  border-right: 1px solid #d9d9d9;
  flex: 1 1 auto;
`;
// ProjectPage title container
const ProjectTitleContainer = styled.div`
  height: 48px;
  line-height: 48px;
  font-size: 18px;
  font-weight: bold;
  padding: 0 12px;
`;
// ProjectPage Image container
const ProjectImageContainer = styled.div`
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
// ProjectPage tags container
const ProjectTagsContainer = styled.div`
  height: 40px;
  border-bottom: 1px solid #d9d9d9;
  display: flex;
  align-items: center;
`;
// ProjectPage description container
const ProjectDescriptionContainer = styled.div`
  flex: 1 1 0;
  border-bottom: 1px solid #d9d9d9;
  padding: 10px;
`;

// tag
const TagsContainer = styled.div`
  display: flex;
  margin: 0px 8px;
  width: 340px;
  overflow: scroll;
  white-space: nowrap;
  ::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
`;

/**
 * @description display tags of project
 * @module TagsPanel
 * @author xiaohan kong
 * @param tags tags data
 * @export module: TagsPanel
 */
const TagsPanel = ({ tags }: { tags: string[] }) => {
  // NOTE
  const tagRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<NodeJS.Timer>();
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

  // NOTE
  const autoScroll = () => {
    const scroll = () => {
      if (!tagRef.current) return;
      else;
      if (tagRef.current.scrollWidth <= tagRef.current.clientWidth) return;
      else;
      if (tagRef.current.scrollLeft + tagRef.current.clientWidth === tagRef.current.scrollWidth) {
        tagRef.current.scrollLeft = 0;
      } else {
        tagRef.current.scrollLeft += 2;
      }
    };
    if (!tagRef.current) return;
    else;
    intervalRef.current = setInterval(scroll, 100);
    tagRef.current.onmouseenter = () => {
      clearInterval(intervalRef.current);
    };
    tagRef.current.onmouseleave = () => {
      intervalRef.current = setInterval(scroll, 100);
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
      clearInterval(intervalRef.current);
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
 * @description projectDetailPage
 * @module projectDetailPage
 * @Author xiaohan kong
 * @param id Project id
 * @export module: projectDetailPage
 */
type ProjectDetailPageProps = {
  id: string;
};
export const ProjectDetailPage = ({ id }: ProjectDetailPageProps) => {
  const [data, setData] = useState<ServerProject>();
  const [imageUrl, setImageUrl] = useState<string>();
  const dataAction = useData();

  useEffect(() => {
    axios
      .request({
        url: "http://localhost:3456/api/project/project",
        params: {
          id: id,
          action: "data",
        },
      })
      .then((res) => {
        if (typeof res.data.content === "object") setData(res.data.content);
        else;
        if (!res.data.content.image) {
          setImageUrl(process.env.PUBLIC_URL + "/no_data.png");
        } else {
          dataAction.getData(res.data.content.image, "image", {}, "blob").then((res) => {
            const blob = new Blob([res]);
            const url = window.URL.createObjectURL(blob);
            setImageUrl(url);
          });
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return data ? (
    <ProjectContainer>
      <ProjectTitleContainer>{data.title}</ProjectTitleContainer>
      <ProjectImageContainer>
        <img alt="view" className="view" src={imageUrl} />
      </ProjectImageContainer>
      <ProjectTagsContainer>
        <TagsPanel tags={data.tags} />
      </ProjectTagsContainer>
      <ProjectDescriptionContainer>{data.description}</ProjectDescriptionContainer>
    </ProjectContainer>
  ) : (
    <></>
  );
};

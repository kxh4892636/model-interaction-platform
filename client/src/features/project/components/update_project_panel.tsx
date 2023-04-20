/*
 * @File: save_project_panel
 * @Author: xiaohan kong
 * @Date: 2023-04-03
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-11
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import { Button, Form, Input, message } from "antd";
import axios from "axios";
import { useState } from "react";
import { useMapPositionStore } from "../../../stores/map_postion_store";
import { useProjectStatusStore } from "../../../stores/project_status_store";
import TextArea from "antd/es/input/TextArea";
import { useMapStore } from "../../../stores";
import { serverHost } from "../../../config/global_variable";

/**
 * @description UpdateProjectPanel
 * @module SaveProjectPanel
 * @author xiaohankong
 * @param setIsShowSaveInfo
 * @export module: SaveProjectPanel
 */
export const UpdateProjectPanel = ({
  setIsShowSaveInfo,
}: {
  setIsShowSaveInfo: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isPosition, setIsPosition] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const projectKey = useProjectStatusStore((state) => state.key);
  const position = useMapPositionStore((state) => state.position);
  const setIsSpinning = useProjectStatusStore((state) => state.setIsSpinning);
  const map = useMapStore((state) => state.map);

  return (
    <>
      <div style={{ padding: "6px 12px" }}>项目配置</div>
      <Form
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        style={{ maxWidth: 360, padding: "10px 14px" }}
        onFinish={async (value) => {
          let result;
          if (isPosition) {
            const urlData = map?.getCanvas().toDataURL()!;
            let base = window.atob(urlData.substring(urlData.indexOf(",") + 1));
            let length = base.length;
            let url = new Uint8Array(length);
            while (length--) {
              url[length] = base.charCodeAt(length);
            }
            let file = new File([url], `logo.png`, {
              type: "image/png",
            });
            let param = new FormData();
            param.append("datasetID", "assets");
            param.append("file", file);
            result = await axios.request({
              url: serverHost + "/api/data/upload",
              method: "post",
              headers: { "Content-Type": "multipart/form-data" },
              data: param,
            });
          } else;
          axios
            .request({
              url: serverHost + "/api/project/action",
              method: "post",
              data: {
                action: "updateInfo",
                id: projectKey,
                title: value.title,
                image: isPosition && (result as any).data,
                tags:
                  value.tags && Array.isArray(value.tags.split()) && value.tags.trim().split(" "),
                description: value.description,
                position: isPosition && position.map((value) => value.toString()),
              },
            })
            .then((res) => {
              const result = res.data;
              if (result.status === "success") {
                message.success("项目保存成功", 10);
                setIsShowSaveInfo(false);
              } else {
                message.error("项目保存失败", 10);
              }
              setIsLoading(false);
              setIsPosition(false);
              setIsSpinning(false);
            });
        }}
        onFinishFailed={() => {
          message.error("项目保存失败", 10);
          setIsLoading(false);
          setIsSpinning(false);
        }}
        autoComplete="off"
      >
        <Form.Item label="标题" name="title">
          <Input />
        </Form.Item>
        <Form.Item label="范围" name="position">
          <Button
            onClick={() => {
              setIsPosition(true);
            }}
            type="default"
          >
            将地图移动至研究区域后点击按钮
          </Button>
        </Form.Item>
        <Form.Item label="标签" name="tags">
          <Input placeholder="tag1 tag2 tag3" />
        </Form.Item>
        <Form.Item label="描述" name="description">
          <TextArea
            showCount
            maxLength={100}
            style={{ height: 180, resize: "none" }}
            placeholder="请输入项目描述"
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 22 }}>
          <Button
            onClick={() => {
              setIsShowSaveInfo(false);
            }}
            type="primary"
            htmlType="button"
            danger
          >
            取消
          </Button>
          <Button
            loading={isLoading}
            onClick={() => {
              setIsSpinning(true);
              setIsLoading(true);
            }}
            type="primary"
            htmlType="submit"
            style={{ marginLeft: "120px" }}
          >
            确认
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

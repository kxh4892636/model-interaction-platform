/*
 * @File: save_project_panel
 * @Author: xiaohan kong
 * @Date: 2023-04-93
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-93
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Upload } from "antd";
import { RcFile } from "antd/es/upload";
import axios from "axios";
import { useState } from "react";
import styled from "styled-components/macro";
import useMapPositionStore from "../../../stores/map_postion_store";
import useProjectStatusStore from "../../../stores/project_status_store";

const StyledUpload = styled(Upload)`
  &&& .ant-upload {
    width: 260px;
    height: 240px;
  }
`;

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.onload = () => callback(reader.result as string);
  reader.readAsDataURL(img);
};

const SaveProjectPanel = ({
  setIsShowSaveInfo,
}: {
  setIsShowSaveInfo: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [isPosition, setIsPosition] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [imageLoading, setImageLoading] = useState(false);
  const [imageKey, setImageKey] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const setProjectKey = useProjectStatusStore((state) => state.setKey);
  const position = useMapPositionStore((state) => state.position);

  const uploadButton = (
    <div>
      {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8, color: "#bfbfbf" }}>请上传数据集预览图片(可选)</div>
    </div>
  );

  return (
    <>
      <div style={{ padding: "6px 12px" }}>数据集配置</div>
      <Form
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        style={{ maxWidth: 360, padding: "10px 14px" }}
        onFinish={(value) => {
          if (!isPosition) {
            setIsLoading(false);
            message.error("未确认空间范围", 10);
            return;
          } else;
          axios
            .request({
              url: "http://localhost:3456/project/action",
              method: "post",
              data: {
                action: "save",
                title: value.caseTitle,
                imageKey: imageKey,
                author: value.author,
                keys: [],
                position: position,
              },
            })
            .then((res) => {
              const result = res.data;
              if (result.status === "success") {
                message.success("项目保存成功", 10);
                setIsShowSaveInfo("");
                setProjectKey(result.data);
              } else {
                message.error("项目保存失败", 10);
              }
              setIsLoading(false);
              setIsShowSaveInfo("");
              setImageUrl(undefined);
              setImageLoading(false);
              setImageKey(undefined);
              setIsPosition(false);
            });
        }}
        onFinishFailed={() => {
          setIsLoading(false);
          message.error("数据集保存失败", 10);
        }}
        autoComplete="off"
      >
        <Form.Item
          label="标题"
          name="caseTitle"
          rules={[{ required: true, message: "请输入数据集标题" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="作者"
          name="author"
          rules={[{ required: true, message: "请输入作者姓名" }]}
        >
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
        <Form.Item
          label="图片"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e?.fileList;
          }}
        >
          <StyledUpload
            name="file"
            listType="picture-card"
            maxCount={1}
            showUploadList={false}
            action={"http://localhost:3456/data/upload"}
            onChange={(info) => {
              if (info.file.status === "uploading") {
                setImageLoading(true);
                return;
              }
              if (info.file.status === "done") {
                setImageKey(info.file.response);
                getBase64(info.file.originFileObj as RcFile, (url) => {
                  setImageLoading(false);
                  setImageUrl(url);
                });
              }
            }}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
            ) : (
              uploadButton
            )}
          </StyledUpload>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 18, span: 6 }}>
          <Button
            loading={isLoading}
            onClick={() => {
              setIsLoading(true);
            }}
            type="primary"
            htmlType="submit"
          >
            确认
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default SaveProjectPanel;

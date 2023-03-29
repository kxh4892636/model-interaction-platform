/*
 * @File: save_panel
 * @Author: xiaohan kong
 * @Date: 2023-03-28
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-03-28
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Select, Upload } from "antd";
import { RcFile } from "antd/es/upload";
import axios from "axios";
import produce from "immer";
import { useState } from "react";
import styled from "styled-components/macro";
import {
  PanelContainer,
  PanelContentContainer,
  PanelTitleContainer,
  PanelToolsContainer,
} from "../../components/layout";
import { useKeys } from "../../hooks";
import useLayersStore from "../../stores/layers_store";

const { TextArea } = Input;

const StyledButton = styled(Button)`
  /* margin: 0px 2px; */
  margin-right: auto;
  margin-left: 6px;
`;

const StyledUpload = styled(Upload)`
  &&& .ant-upload {
    width: 240px;
    height: 240px;
  }
`;

const selectOptionDefault = [
  {
    label: "项目分类",
    options: [
      { value: "data", label: "数据集", disabled: false },
      { value: "example", label: "示例集", disabled: false },
    ],
  },
  {
    label: "模型分类",
    options: [
      { value: "hydrodynamics", label: "水动力模型", disabled: false },
      { value: "ecopath", label: "Ecopath 模型", disabled: false },
    ],
  },
];

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.onload = () => callback(reader.result as string);
  reader.readAsDataURL(img);
};

const SavePanel = () => {
  const [isShowSaveInfo, setIsShowSaveInfo] = useState(false);
  const [selectOption, setSelectOption] = useState(selectOptionDefault);
  const [imageUrl, setImageUrl] = useState<string>();
  const [imageLoading, setImageLoading] = useState(false);
  const [imageKey, setImageKey] = useState<string>();
  const getKeys = useKeys();
  const layers = useLayersStore((state) => state.layers);

  const uploadButton = (
    <div>
      {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8, color: "#bfbfbf" }}>请上传项目预览图片(可选)</div>
    </div>
  );

  return (
    <PanelContainer>
      <PanelTitleContainer>保存面板</PanelTitleContainer>
      <PanelToolsContainer>
        <StyledButton onClick={() => setIsShowSaveInfo(true)}>保存至服务器</StyledButton>
        {/* <StyledButton>保存至本地</StyledButton>
        <StyledButton>从本地加载</StyledButton> */}
      </PanelToolsContainer>
      <PanelContentContainer>
        {isShowSaveInfo ? (
          <>
            <div style={{ padding: "6px 12px" }}>项目配置</div>
            <Form
              name="basic"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              style={{ maxWidth: 340, padding: "10px 10px" }}
              onFinish={(value) => {
                console.log(value);
                const keys = getKeys.getLayerKeys(layers);
                axios
                  .request({
                    url: "http://localhost:3456/case/save",
                    method: "post",
                    data: {
                      title: value.caseTitle,
                      imageKey: imageKey,
                      author: value.author,
                      tags: value.tags,
                      description: value.description,
                      keys: keys,
                    },
                  })
                  .then((res) => {
                    const result = res.data;
                    console.log(res.data);
                    if (result.status === "success") {
                      message.success("模型案例保存成功", 10);
                      setTimeout(() => {
                        setIsShowSaveInfo(false);
                      }, 1000);
                    } else {
                      message.error("模型案例保存失败", 10);
                    }
                    setIsShowSaveInfo(false);
                    setSelectOption(selectOptionDefault);
                    setImageUrl(undefined);
                    setImageLoading(false);
                    setImageKey(undefined);
                  });
              }}
              onFinishFailed={() => {}}
              autoComplete="off"
            >
              <Form.Item
                label="标题"
                name="caseTitle"
                rules={[{ required: true, message: "请输入项目标题" }]}
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
              <Form.Item
                label="标签"
                name="tags"
                rules={[{ required: true, message: "请选择项目标签" }]}
              >
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="请选择标签"
                  onClear={() => {
                    setSelectOption(selectOptionDefault);
                  }}
                  onChange={(values: string[]) => {
                    setSelectOption(
                      produce((draft) => {
                        draft.forEach((group) => {
                          let tag = false;
                          group.options.forEach((option) => {
                            values.forEach((value) => {
                              if (option.value === value) tag = true;
                              else;
                            });
                          });
                          if (tag) {
                            group.options.forEach((option) => {
                              option.disabled = true;
                            });
                          } else;
                        });
                      })
                    );
                  }}
                  options={selectOption}
                />
              </Form.Item>
              <Form.Item label="描述" name="description">
                <TextArea
                  showCount
                  maxLength={100}
                  style={{ height: 180, resize: "none" }}
                  placeholder="请输入项目描述(可选)"
                />
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
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </>
        ) : (
          <></>
        )}
      </PanelContentContainer>
    </PanelContainer>
  );
};

export default SavePanel;

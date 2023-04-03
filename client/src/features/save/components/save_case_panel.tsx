/*
 * @File: save_case_panel
 * @Author: xiaohan kong
 * @Date: 2023-04-93
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-04-93
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
import { useKeys } from "../../../hooks";
import useLayersStore from "../../../stores/layers_store";
import useProjectStatusStore from "../../../stores/project_status_store";

const { TextArea } = Input;

const StyledUpload = styled(Upload)`
  &&& .ant-upload {
    width: 260px;
    height: 240px;
  }
`;

const selectOptionDefault = [
  {
    label: "输入输出分类",
    options: [
      { value: "input", label: "数据集", disabled: false },
      { value: "output", label: "示例集", disabled: false },
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

const SaveCasePanel = ({
  setIsShowSaveInfo,
}: {
  setIsShowSaveInfo: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [selectOption, setSelectOption] = useState(selectOptionDefault);
  const [imageUrl, setImageUrl] = useState<string>();
  const [imageLoading, setImageLoading] = useState(false);
  const [imageKey, setImageKey] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const getKeys = useKeys();
  const layers = useLayersStore((state) => state.layers);
  const projectKey = useProjectStatusStore((state) => state.key);
  const setIsSpinning = useProjectStatusStore((state) => state.setIsSpinning);

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
          const keys = getKeys.getLayerKeys(layers);
          if (!projectKey.includes("-")) {
            setIsLoading(false);
            message.error("暂未保存项目, 请先保存项目", 10);
            return;
          } else if (!keys.length) {
            setIsLoading(false);
            message.error("数据集保存失败, 无数据可以保存", 10);
            return;
          } else;
          axios
            .request({
              url: "http://localhost:3456/case/action",
              method: "post",
              data: {
                action: "save",
                title: value.caseTitle,
                imageKey: imageKey,
                author: value.author,
                tags: value.tags,
                description: value.description,
                keys: keys,
                projectKey: projectKey,
              },
            })
            .then((res) => {
              const result = res.data;
              console.log(res.data);
              if (result.status === "success") {
                message.success("数据集保存成功", 10);
                setIsShowSaveInfo("");
              } else {
                message.error("数据集保存失败", 10);
              }
              setIsLoading(false);
              setIsShowSaveInfo("");
              setSelectOption(selectOptionDefault);
              setImageUrl(undefined);
              setImageLoading(false);
              setImageKey(undefined);
            });
          setIsSpinning(false);
        }}
        onFinishFailed={() => {
          setIsSpinning(false);
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
        <Form.Item
          label="标签"
          name="tags"
          rules={[{ required: true, message: "请选择数据集标签" }]}
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
            placeholder="请输入数据集描述(可选)"
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
                setIsSpinning(false);
              }
            }}
            beforeUpload={() => {
              setIsSpinning(true);
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
              setIsSpinning(true);
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

export default SaveCasePanel;

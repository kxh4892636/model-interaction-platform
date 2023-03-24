/*
 * @File: ModelPanel
 * @Author: xiaohan kong
 * @Date: 2023-03-24
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-03-24
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

interface AppProps {
  title: string;
  handleRun?: () => {};
  handleStop?: () => {};
}

/**
 * @description ModelPanel
 * @module ModelPanel
 * @author xiaohan kong
 * @param info the info of ModelPanel
 * @export module: ModelPanel
 */
const ModelPanel = ({ title, handleRun, handleStop }: AppProps) => {};

export default ModelPanel;

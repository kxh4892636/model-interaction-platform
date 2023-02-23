/*
 * @File: MapStatus component
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-02-16
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import styled from "styled-components";

const StyledDiv = styled.div`
  background-color: #fff;
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #d9d9d9;
`;

/**
 * @description MapStatus component, accept map center position and display it
 * @module MapStatus
 * @Author xiaohan kong
 * @param position [lng, lat, zoom]
 * @export module: MapStatus
 */
const MapStatus = ({ position }: { position: [number, number, number] }) => {
  return (
    <StyledDiv>
      经度:{position[0]} | 纬度:{position[1]} | 缩放等级:{position[2]}
    </StyledDiv>
  );
};

export default MapStatus;

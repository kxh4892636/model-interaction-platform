/*
 * @File: LayerOutlined component - icon
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-02-16
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

const LayerOutlined: React.FC<{ style: React.CSSProperties }> = ({ style }) => {
  return (
    <span
      style={{ padding: "0px", lineHeight: "0px", fontSize: "14px", color: "#595959", ...style }}
    >
      <svg
        className="icon"
        viewBox="64 64 896 896"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="1394"
        width="1em"
        height="1em"
      >
        <path
          d="M512 139.818667L234.794667 320 512 500.181333 789.205333 320 512 139.818667zM938.666667 320L512 597.333333 85.333333 320 512 42.666667l426.666667 277.333333z"
          fill="currentColor"
          p-id="1395"
        ></path>
        <path
          d="M147.498667 426.666667L512 681.173333 876.501333 426.666667 938.666667 470.101333 512 768 85.333333 470.101333 147.498667 426.666667z m0 170.666666L512 851.84 876.501333 597.333333 938.666667 640.768 512 938.666667 85.333333 640.768 147.498667 597.333333z"
          fill="currentColor"
          p-id="1396"
        ></path>
      </svg>
    </span>
  );
};

export default LayerOutlined;

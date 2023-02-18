export type LayerMenuItem = {
  /**
   * item 的 key
   */
  key: string;
  label: string;
  action: Function;
};

export type DataListData = { key: string; title: string; image: string; author: string };
export type DataDetailData = {
  key: string;
  title: string;
  image: string;
  tags: string[];
  author: string;
  time: string;
  description: string;
  data: string;
};

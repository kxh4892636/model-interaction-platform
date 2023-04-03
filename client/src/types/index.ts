export type Layer = {
  title: string;
  key: string;
  type: string;
  layerStyle: string;
  group: boolean;
  children: Layer[];
};

export type ServerData = {
  id: string;
  title: string;
  data: string[];
  style: string;
  type: string;
  temp: boolean;
  extent: number[];
  transform: string[];
  progress: [string, string?];
};

export type ServerCase = {
  id: string;
  title: string;
  image: string;
  tags: string[];
  author: string;
  time: string;
  description: string;
  data: string[];
  count: number;
};

export type ServerProject = {
  id: string;
  title: string;
  image: string;
  author: string;
  description: string;
  count: number;
  data: string[];
  position: string[];
};

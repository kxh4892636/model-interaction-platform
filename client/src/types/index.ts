export type Layer = {
  title: string;
  key: string;
  type: string;
  layerStyle: string;
  group: boolean;
  children: Layer[];
  input?: boolean;
};

export type ServerProject = {
  id: string;
  title: string;
  image: string;
  data: string[];
  position: string[];
  tags: string[];
  description: string[];
};

export type ServerDataset = {
  id: string;
  title: string;
  data: string[];
  project: string;
};

export type ServerData = {
  id: string;
  title: string;
  style: string;
  type: string;
  extent: number[];
  dataset: string;
  input: boolean;
  transformNum: string;
};

export type ServerModel = {
  id: string;
  pids: string[];
  is_running: boolean;
  progress: number[];
  dataset: string;
};

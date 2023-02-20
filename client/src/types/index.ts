export type Layer = {
  title: string;
  key: string;
  group: boolean;
  children: Layer[];
};

export type ServerData = {
  id: string;
  title: string;
  data: string;
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
};

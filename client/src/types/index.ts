export type Layer = {
  title: string;
  key: string;
  src: string;
  group: boolean;
  children: Layer[];
};

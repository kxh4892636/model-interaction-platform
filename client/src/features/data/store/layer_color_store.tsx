import { create } from "zustand";
import { produce } from "immer";

interface LayerColorStoreType {
  colors: string[];
  getColor: () => string;
}

const useLayerColorStore = create<LayerColorStoreType>((set, get) => ({
  colors: ["#e41a1c", "#003eb3", "#237804", "#984ea3", "#ff7f00"],
  getColor: () => {
    const colors = get().colors;
    const random = Math.floor(Math.random() * colors.length);
    const color = colors[random];
    colors.splice(random, 1);
    if (colors.length === 0) {
      set({
        colors: ["#e41a1c", "#003eb3", "#237804", "#984ea3", "#ff7f00"],
      });
    }
    return color;
  },
}));

export { useLayerColorStore };

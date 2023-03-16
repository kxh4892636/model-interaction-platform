import { create } from "zustand";
const ExchangeFlag = create((set, get) => ({
    Flag:false,
    // 单纯更新状态
    setFlag: (preFlag) =>{
      set((state) => ({
        Flag: !preFlag
  }))},
  }));
  export {ExchangeFlag}
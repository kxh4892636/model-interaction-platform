import { create } from 'zustand'

interface ModalStore {
  modal: JSX.Element
  isModalDisplay: boolean
  setModal: (element: JSX.Element) => void
  setIsModalDisplay: (tag: boolean) => void
}

export const useModalStore = create<ModalStore>((set) => ({
  modal: <></>,
  isModalDisplay: false,
  setModal: (element) => {
    set({ modal: element })
  },
  setIsModalDisplay(tag) {
    set({ isModalDisplay: tag })
  },
}))

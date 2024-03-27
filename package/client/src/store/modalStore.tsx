import { create } from 'zustand'

interface ModalStore {
  modal: JSX.Element | null
  isModalDisplay: boolean
  openModal: (element: JSX.Element) => void
  closeModal: () => void
}

const ModalContainer = ({ children }: { children: JSX.Element }) => {
  return (
    <div
      className="fixed z-50 h-full w-screen bg-slate-500/20"
      onClick={() => {
        //
      }}
    >
      {children}
    </div>
  )
}

export const useModalStore = create<ModalStore>((set) => ({
  modal: null,
  isModalDisplay: false,
  openModal: (element) => {
    set({
      modal: <ModalContainer>{element}</ModalContainer>,
      isModalDisplay: true,
    })
  },
  closeModal: () => {
    set({
      modal: null,
      isModalDisplay: false,
    })
  },
}))

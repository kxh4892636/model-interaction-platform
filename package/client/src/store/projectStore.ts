import { create } from 'zustand'

interface ProjectStatus {
  projectID: string
  setProjectID: (key: string) => void
}

export const useProjectStatusStore = create<ProjectStatus>((set) => ({
  projectID: '',
  setProjectID: (value) => set({ projectID: value }),
}))

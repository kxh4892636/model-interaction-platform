import { create } from 'zustand'

interface ProjectStatus {
  projectID: string | null
  setProjectID: (key: string | null) => void
}

export const useProjectStatusStore = create<ProjectStatus>((set) => ({
  projectID: null,
  setProjectID: (value) => set({ projectID: value }),
}))

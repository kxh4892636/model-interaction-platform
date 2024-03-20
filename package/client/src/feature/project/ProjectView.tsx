import { ProjectCardList } from './ProjectCardList'
import { useProjectListData } from './project.hook'

export const ProjectView = () => {
  const projectListData = useProjectListData()

  return (
    <div className="relative flex flex-auto flex-col bg-white">
      <div
        className="flex h-12 items-center border-0 border-b border-slate-300
          px-3"
      >
        项目列表
      </div>
      <div
        className="m-10 flex max-h-[80vh] flex-auto rounded-xl border
          border-slate-300 bg-slate-300/5 shadow-lg shadow-slate-300"
      >
        {projectListData.status === 'success' && (
          <ProjectCardList
            projectListData={projectListData.data!}
          ></ProjectCardList>
        )}
      </div>
    </div>
  )
}

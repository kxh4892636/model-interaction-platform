import { useModalStore } from '@/store/modalStore'
import { TemplateCardList } from './TemplateCardList'
import { useTemplateListData } from './project.hook'

export const TemplateModal = () => {
  const templateListData = useTemplateListData()
  const setIsModalDisplay = useModalStore((state) => state.setIsModalDisplay)
  const setModal = useModalStore((state) => state.setModal)

  return (
    <div
      className="absolute flex h-screen w-screen bg-slate-500/20"
      onClick={() => {}}
    >
      <div
        className="relative left-[19vw] top-[10vh] flex h-[80vh] w-[80rem]
          flex-col rounded-xl border border-slate-300 bg-white shadow-lg
          shadow-slate-300"
      >
        <div
          className="absolute right-4 top-3 bg-slate-400"
          onClick={() => {
            setModal(<></>)
            setIsModalDisplay(false)
          }}
        >
          关闭
        </div>
        <div
          className="flex h-12 items-center border-0 border-b border-slate-300
            px-4"
        >
          项目列表
        </div>
        {templateListData.status === 'success' && (
          <TemplateCardList
            templateListData={templateListData.data!}
          ></TemplateCardList>
        )}
      </div>
    </div>
  )
}

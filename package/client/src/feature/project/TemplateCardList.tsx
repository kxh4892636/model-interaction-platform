import { useModalStore } from '@/store/modalStore'
import { useStateStore } from '@/store/stateStore'
import { Button, Card } from 'antd'
import Meta from 'antd/es/card/Meta'
import { createProjectFromTemplate } from './project.api'
import { TemplateListType } from './project.type'

const generateCardList = (
  templateListData: TemplateListType,
  handleClose: () => void,
) => {
  const result = templateListData.map((data) => (
    <Card
      className="m-6 h-80 w-60 first:ml-8"
      cover={
        <img alt="cover" src={data.templateCoverImage} className="h-48 w-56" />
      }
      key={data.templateID}
      size={'small'}
      actions={[
        <Button
          type="primary"
          onClick={async () => {
            await createProjectFromTemplate(data.templateID, data.templateName)
            handleClose()
          }}
        >
          新建项目
        </Button>,
      ]}
    >
      <Meta title={data.templateName} description={'根据模板创建项目'} />
    </Card>
  ))

  return result
}

interface AppProps {
  templateListData: TemplateListType
}
export const TemplateCardList = ({ templateListData }: AppProps) => {
  const setIsModalDisplay = useModalStore((state) => state.setIsModalDisplay)
  const setModal = useModalStore((state) => state.setModal)
  const forceUpdate = useStateStore((state) => state.forceUpdate)

  const cardList = generateCardList(templateListData, () => {
    setIsModalDisplay(false)
    setModal(<></>)
    forceUpdate()
  })

  return (
    <div className="mx-6 mb-4 flex flex-auto flex-wrap overflow-auto ">
      {cardList}
    </div>
  )
}

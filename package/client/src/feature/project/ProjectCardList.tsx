import { useModalStore } from '@/store/modalStore'
import { Button, Card, Popconfirm } from 'antd'
import Meta from 'antd/es/card/Meta'
import { CardTag } from './CardTag'
import { TemplateModal } from './TemplateModal'
import { ProjectListType } from './project.type'

const generateCardList = (
  projectListData: ProjectListType,
  handleInit: () => void,
) => {
  const result = projectListData.map((data) => (
    <Card
      className="m-6 h-80 w-60 first:ml-8"
      cover={
        <img alt="cover" src={data.projectCoverImage} className="h-48 w-56" />
      }
      key={data.projectId}
      size={'small'}
      actions={[
        <Popconfirm
          title="加载项目"
          description="已存在项目, 加载该项目将取消目前一切操作?"
          onConfirm={async () => {
            //
          }}
          okText="确定加载"
          cancelText="取消加载"
        >
          <Button type="primary">加载项目</Button>
        </Popconfirm>,
        <Popconfirm
          title="删除项目"
          description="你是否确定删除该项目?"
          onConfirm={() => {}}
          okText="确定删除"
          cancelText="取消删除"
        >
          <Button type="primary" danger>
            删除项目
          </Button>
        </Popconfirm>,
      ]}
    >
      <Meta
        title={data.projectName}
        description={<CardTag tags={data.projectTag}></CardTag>}
      />
    </Card>
  ))
  result.unshift(
    <Card
      className="m-6 max-h-80 w-60"
      cover={
        <img
          alt="cover"
          src={'/new-project.png'}
          className="h-56 w-56"
          onClick={handleInit}
        />
      }
      key={'new'}
      size={'small'}
    >
      <Meta title={'新建项目'} description={'点击上方图片从模板新建项目'} />
    </Card>,
  )

  return result
}

interface AppProps {
  projectListData: ProjectListType
}
export const ProjectCardList = ({ projectListData }: AppProps) => {
  const setIsModalDisplay = useModalStore((state) => state.setIsModalDisplay)
  const setModal = useModalStore((state) => state.setModal)

  const cardList = generateCardList(projectListData, () => {
    setIsModalDisplay(true)
    setModal(<TemplateModal />)
  })

  return (
    <div className="flex flex-auto flex-wrap overflow-auto">{cardList}</div>
  )
}

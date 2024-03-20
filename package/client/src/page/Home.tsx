import { MapView } from '@/feature/map'
import { Nav } from '@/feature/nav'
import { NavItem } from '@/feature/nav/nav.type'
import { getTemplateListData } from '@/feature/project/project.api'
import { useForceUpdate } from '@/hook/useForceUpdate'
import { ExtendRouter, route } from '@/router'
import { useMapStore } from '@/store/mapStore'
import { useModalStore } from '@/store/modalStore'
import {
  AppstoreOutlined,
  DatabaseOutlined,
  MediumOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import { useNavigate, useRoutes } from 'react-router-dom'

// TODO ref 是引用 ref.current 不是
const test = (number: React.MutableRefObject<number>) => {
  number.current++
}

export const Home = () => {
  const modal = useModalStore((state) => state.modal)
  const isModalDisplay = useModalStore((state) => state.isModalDisplay)
  const isDisplay = useMapStore((state) => state.isDisplay)
  const element = useRoutes(route)
  const navigate = useNavigate()
  const navItems: NavItem[] = [
    {
      title: '项目',
      id: 'project',
      icon: <AppstoreOutlined style={{ color: '#fafafa' }} />,
      action: () => {
        navigate('/project')
      },
    },
    {
      title: '图层',
      id: 'layer',
      icon: <DatabaseOutlined style={{ color: '#fafafa' }} />,
      action: () => {
        //
        navigate('/layer')
      },
    },
    {
      title: '模型',
      id: 'model',
      icon: <MediumOutlined style={{ color: '#fafafa' }} />,
      action: () => {
        //
      },
    },
    {
      title: '详情',
      id: 'info',
      icon: <SaveOutlined style={{ color: '#fafafa' }} />,
      action: () => {
        //
      },
    },
  ]
  const forceUpdate = useForceUpdate()

  const testClick = async () => {
    console.log(await getTemplateListData())
  }

  return (
    <div className="relative flex h-screen w-screen flex-col">
      <div
        className="flex h-14 items-center bg-[#1b6ec8] p-3 text-xl
          tracking-widest text-white"
      >
        港口水环境与生态动力学精细化模拟平台
        <button className="h-4 w-4 bg-red-400" onClick={testClick}></button>
      </div>
      <div className="flex flex-auto bg-pink-50">
        <div className="w-16 bg-red-50">
          <Nav items={navItems}></Nav>
        </div>
        <div className="relative flex flex-auto bg-green-50">
          <ExtendRouter>{element}</ExtendRouter>
          <MapView display={isDisplay}></MapView>
        </div>
      </div>
      {isModalDisplay && modal}
    </div>
  )
}

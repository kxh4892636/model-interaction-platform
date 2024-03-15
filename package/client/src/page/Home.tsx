import { MapView } from '@/feature/map'
import { Nav } from '@/feature/nav'
import { useMapStore } from '@/store/mapStore'
import {
  AppstoreOutlined,
  DatabaseOutlined,
  MediumOutlined,
  SaveOutlined,
} from '@ant-design/icons'

const navItems = [
  {
    title: '项目',
    id: 'project',
    icon: <AppstoreOutlined style={{ color: '#fafafa' }} />,
    type: 'view',
  },
  {
    title: '图层',
    id: 'layer',
    icon: <DatabaseOutlined style={{ color: '#fafafa' }} />,
    type: 'panel',
  },
  {
    title: '模型',
    id: 'model',
    icon: <MediumOutlined style={{ color: '#fafafa' }} />,
    type: 'view',
  },
  {
    title: '详情',
    id: 'info',
    icon: <SaveOutlined style={{ color: '#fafafa' }} />,
    type: 'panel',
  },
]

export const Home = () => {
  const isDisplay = useMapStore((state) => state.isDisplay)

  return (
    <div className="relative flex h-screen w-screen flex-col">
      <div className="flex h-14 items-center bg-slate-200 text-xl">
        <div className="mx-3 text-xl font-medium">
          港口水环境与生态动力学精细化模拟平台
        </div>
      </div>
      <div className="flex w-full flex-auto bg-pink-50">
        <div className="w-16 bg-red-50">
          <Nav items={navItems}></Nav>
        </div>
        <div className="relative flex-auto bg-green-50">
          <MapView display={isDisplay}></MapView>
        </div>
      </div>
    </div>
  )
}

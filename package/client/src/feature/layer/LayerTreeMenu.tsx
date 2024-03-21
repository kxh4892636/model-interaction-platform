import { EllipsisOutlined } from '@ant-design/icons'
import { Dropdown, MenuProps } from 'antd'
import { LayerMenuItemType } from './layer.type'

interface AppProps {
  layerMenuItems: LayerMenuItemType[]
}
export const LayerTreeMenu = ({ layerMenuItems }: AppProps) => {
  const createItems = (layerMenuItems: LayerMenuItemType[]) => {
    const array: MenuProps['items'] = []
    layerMenuItems.forEach((value) => {
      array.push({ key: value.key, label: value.label })
    })
    return array
  }
  const items = createItems(layerMenuItems)

  return (
    <Dropdown
      menu={{
        items,
        onClick: (e) => {
          layerMenuItems.forEach((value) => {
            if (value.key === e.key) value.action()
          })
        },
      }}
      trigger={['click']}
    >
      <EllipsisOutlined />
    </Dropdown>
  )
}

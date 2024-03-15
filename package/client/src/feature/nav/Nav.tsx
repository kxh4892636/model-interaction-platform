import { Tooltip } from 'antd'
import { NavItemInterface } from './nav.type'

const generateNavItems = (items: NavItemInterface[]) => {
  const result = items.map((value): JSX.Element => {
    return (
      <Tooltip placement="right" title={value.title} key={value.id}>
        <div className="flex justify-center border-0 py-6 text-2xl text-slate-200 hover:text-slate-50">
          {value.icon}
        </div>
      </Tooltip>
    )
  })

  return result
}

interface AppProps {
  items: NavItemInterface[]
}
export const Nav = ({ items }: AppProps) => {
  const NavItems = generateNavItems(items)

  return (
    <>
      <div className="flex h-full w-16 flex-col border-0 border-r border-slate-300 bg-slate-800">
        {NavItems}
      </div>
    </>
  )
}

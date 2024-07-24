import { Header } from '@/component/layout'
import { Router } from '@/router'
import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const App = () => {
  const link = useNavigate()
  const homeRef = useRef<HTMLDivElement | null>(null)
  const location = useLocation()

  const scroll = (index: number) => {
    if (homeRef.current) {
      const viewHeight = window.innerHeight
      homeRef.current.style.top = -index * viewHeight + 'px'
    }
  }

  useEffect(() => {
    if (location.pathname.includes('home')) {
      homeRef.current = document.getElementById('home') as HTMLDivElement
    }
  }, [location])

  return (
    <>
      <Header>港口水环境与生态动力学精细化模拟平台</Header>
      <div
        className="absolute right-8 top-1 z-10 flex h-[4rem] items-center
          text-lg text-white *:m-6"
        id="header-button"
      >
        <div>
          <button
            onClick={() => {
              link('/home')
              setTimeout(() => {
                scroll(0)
              }, 0)
            }}
            className="hover:text-blue-400"
          >
            首页
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              link('/home')
              setTimeout(() => {
                scroll(1)
              }, 0)
            }}
            className="hover:text-blue-400"
          >
            水动力模型
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              link('/home')
              setTimeout(() => {
                scroll(2)
              }, 0)
            }}
            className="hover:text-blue-400"
          >
            水质模型
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              link('/home')
              setTimeout(() => {
                scroll(3)
              }, 0)
            }}
            className="hover:text-blue-400"
          >
            泥沙-抛泥模型
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              link('/home')
              setTimeout(() => {
                scroll(4)
              }, 0)
            }}
            className="hover:text-blue-400"
          >
            生态动力学模型
          </button>
        </div>
      </div>
      <Router></Router>
    </>
  )
}

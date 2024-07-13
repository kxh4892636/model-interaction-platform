import { useEffect, useRef } from 'react'
import { Overview } from './overview'
import { Feature } from './feature'
import water2D from '@/assert/water-2d.png'
import water3D from '@/assert/water-3d.png'
import wasp from '@/assert/wasp.png'
import phreec2D from '@/assert/phreec-2d.png'
import phreec3D from '@/assert/phreec-3d.png'
import sand from '@/assert/sand.png'
import mud from '@/assert/mud.png'
import ewe from '@/assert/ewe.png'
import eweWater from '@/assert/ewe-water.png'

export const Home = () => {
  const homeRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (homeRef.current) {
      let index = 0
      const viewHeight = window.innerHeight
      let start = 0
      homeRef.current.addEventListener('wheel', (e) => {
        if (Date.now() - start > 200) {
          start = Date.now()
          if (e.deltaY > 0) {
            scrollScreen('down')
          } else {
            scrollScreen('up')
          }
        }
      })

      const scrollScreen = (direction: 'up' | 'down' = 'down') => {
        if (direction === 'down') {
          if (index === 4) return
          index++
          homeRef.current!.style.top = -index * viewHeight + 'px'
        } else {
          if (index === 0) return
          index--
          homeRef.current!.style.top = -index * viewHeight + 'px'
        }
        console.log(index)
      }
    }
  }, [])

  return (
    <>
      <div
        id="home"
        className="absolute top-0 w-screen duration-1000"
        ref={homeRef}
      >
        <Overview></Overview>
        <Feature
          modelTitle="水动力模型"
          modelDescription="水动力模型简介"
          cardInfoList={[
            {
              image: water2D,
              modelDescription: '水动力2D模型简介',
              modelTitle: '水动力2D模型',
              modelType: 'water-2d',
            },
            {
              image: water3D,
              modelDescription: '水动力3D模型简介',
              modelTitle: '水动力3D模型',
              modelType: 'water-3d',
            },
          ]}
        ></Feature>
        <Feature
          modelTitle="水质模型"
          modelDescription="水质模型简介"
          cardInfoList={[
            {
              image: wasp,
              modelDescription: 'wasp水质模型简介',
              modelTitle: 'wasp水质模型',
              modelType: 'quality-wasp',
            },
            {
              image: phreec2D,
              modelDescription: '醋酸2D模型简介',
              modelTitle: '醋酸2D模型',
              modelType: 'quality-phreec',
            },
            {
              image: phreec3D,
              modelDescription: '醋酸3D模型简介',
              modelTitle: '醋酸3D模型',
              modelType: 'quality-phreec-3d',
            },
          ]}
        ></Feature>
        <Feature
          modelTitle="泥沙-抛泥模型"
          modelDescription="泥沙-抛泥模型简介"
          cardInfoList={[
            {
              image: sand,
              modelDescription: '泥沙模型简介',
              modelTitle: '泥沙模型',
              modelType: 'sand',
            },
            {
              image: mud,
              modelDescription: '抛泥模型简介',
              modelTitle: '抛泥模型简介',
              modelType: 'mud',
            },
          ]}
        ></Feature>
        <Feature
          modelTitle="生态动力学模型"
          modelDescription="生态动力学模型简介"
          cardInfoList={[
            {
              image: ewe,
              modelDescription: 'ewe模型简介',
              modelTitle: 'ewe模型',
              modelType: 'ewe',
            },
            {
              image: eweWater,
              modelDescription: '水环境-ewe耦合模型简介',
              modelTitle: '水环境-ewe耦合模型简介',
              modelType: 'water-ewe',
            },
          ]}
        ></Feature>
      </div>
    </>
  )
}

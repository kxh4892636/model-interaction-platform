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
import spoil from '@/assert/spoil.png'

export const Home = () => {
  const homeRef = useRef<HTMLDivElement | null>(null)
  let start = 0

  useEffect(() => {
    const handler = (e: WheelEvent) => {
      if (Date.now() - start > 200) {
        start = Date.now()
        if (e.deltaY > 0) {
          scrollScreen('down')
        } else {
          scrollScreen('up')
        }
      }
    }

    const scrollScreen = (direction: 'up' | 'down' = 'down') => {
      const viewHeight = window.innerHeight
      const value = Math.abs(
        Number(homeRef.current!.style.top.replace('px', '')),
      )
      if (direction === 'down') {
        if (value >= 4 * viewHeight) return
        homeRef.current!.style.top = -(value + viewHeight) + 'px'
      } else {
        if (value <= 0) return
        homeRef.current!.style.top = -(value - viewHeight) + 'px'
      }
    }
    homeRef.current!.addEventListener('wheel', handler)

    return () => {
      if (homeRef.current) {
        homeRef.current.removeEventListener('wheel', handler)
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
          modelDescription=""
          cardInfoList={[
            {
              image: water2D,
              modelDescription:
                '专门用于模拟和分析海面水动力的二维水文模型。它通过处理区域网格数据，能够计算出特定区域海面水动力的演变情况，为海洋工程、环境评估和灾害预防提供重要信息。',
              modelTitle: '水动力二维模型',
              modelType: 'water-2d',
            },
            {
              image: water3D,
              modelDescription:
                '水动力三维模型的扩展，它增加了对海中部和海底水动力的三维分析。通过这种模型，可以更全面地理解海洋水动力在不同深度的变化，对海洋资源开发和海洋环境研究具有重要意义。',
              modelTitle: '水动力三维模型',
              modelType: 'water-3d',
            },
          ]}
        ></Feature>
        <Feature
          modelTitle="水质模型"
          modelDescription=""
          cardInfoList={[
            {
              image: wasp,
              modelDescription:
                '综合性的水质模型，能够通过区域网格数据来模拟和预测海水中的多个水质指标，如溶解氧、BOD、浮游植物等。这些指标对于评估海洋生态系统的健康状况和进行水质管理至关重要。',
              modelTitle: 'Wasp水质模型',
              modelType: 'quality-wasp',
            },
            {
              image: phreec2D,
              modelDescription:
                '该模型专注于计算和预测海水的pH值，这是衡量水质酸碱度的关键指标。通过分析区域网格数据，phreec模型可以帮助研究人员和决策者了解海洋酸化的趋势和影响。',
              modelTitle: 'Phreec二维水质模型',
              modelType: 'quality-phreec',
            },
            {
              image: phreec3D,
              modelDescription:
                '作为phreec模型的三维版本，它不仅预测海面pH值，还能提供海中部和海底的pH分布情况。这种模型对于深入研究海洋酸化在不同深度的影响具有重要价值。',
              modelTitle: 'Phreec三维水质模型',
              modelType: 'quality-phreec-3d',
            },
          ]}
        ></Feature>
        <Feature
          modelTitle="泥沙-抛泥模型"
          modelDescription=""
          cardInfoList={[
            {
              image: sand,
              modelDescription:
                '该模型专注于模拟和预测海洋中的泥沙运动和淤积情况。通过分析区域网格数据，泥沙模型可以输出泥沙分布和淤积情况，这对于港口建设、航道维护和海岸线保护等领域至关重要。',
              modelTitle: '泥沙模型',
              modelType: 'sand',
            },
            {
              image: mud,
              modelDescription:
                '这是一个针对特定抛泥点的泥沙迁移模型。通过分析区域网格数据和抛泥点，该模型可以预测泥沙在海洋中的迁移路径和分布，对于海洋环境管理和泥沙资源利用具有指导意义',
              modelTitle: '抛泥计算模型',
              modelType: 'mud',
            },
            {
              image: spoil,
              modelDescription:
                '这是一个泥沙倾倒的扩散模型。通过分析区域网格数据和抛泥船位置和抛泥量，该模型可以预测泥沙在海洋中的迁移路径和分布，对于海洋环境管理和泥沙资源利用具有指导意义',
              modelTitle: '抛泥扩散与沉积快速计算模型',
              modelType: 'spoil',
            },
          ]}
        ></Feature>
        <Feature
          modelTitle="生态动力学模型"
          modelDescription=""
          cardInfoList={[
            {
              image: ewe,
              modelDescription:
                'EWE模型是一种生态模型，用于定量分析水生态系统中的食物网结构和能量流动。通过模拟不同生物群落之间的相互作用，为生态保护和资源管理提供科学依据。',
              modelTitle: 'EWE模型',
              modelType: 'ewe',
            },
            {
              image: eweWater,
              modelDescription:
                'WATER-EWE模型将水质模型与EWE生态模型相结合，能够更加精确全面地解释生态系统中的能量流动特征，揭示该区域的生态系统健康状况和生物多样性，为环境管理和生态恢复提供重要信息。',
              modelTitle: '水环境-EWE耦合模型',
              modelType: 'water-ewe',
            },
          ]}
        ></Feature>
      </div>
    </>
  )
}

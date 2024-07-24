import { useMetaStore } from '@/store/metaStore'
import { WaterModelTypeType } from '@/type'
import { Button } from 'antd'
import { NavigateFunction, useNavigate } from 'react-router-dom'

interface CardInfo {
  modelTitle: string
  image: string
  modelDescription: string
  modelType: WaterModelTypeType
}
const generateCardList = (
  infoList: CardInfo[],
  link: NavigateFunction,
  setModelType: (modelType: WaterModelTypeType) => void,
) => {
  const cardList = infoList.map((value, index) => {
    return (
      <div key={index} className="flex flex-1 justify-center">
        <div
          className="group flex w-[28rem] flex-col items-center rounded-2xl
            border border-slate-200 bg-white hover:scale-105 hover:shadow-2xl"
        >
          <div className="my-8 mt-12 text-2xl tracking-wider">
            {value.modelTitle}
          </div>
          <img src={value.image} className="h-80 w-96 bg-slate-300"></img>
          <div className="my-8 min-h-20 w-[22rem]">
            {value.modelDescription}
          </div>
          <Button
            type="default"
            className="group-hover:border-blue-400 group-hover:text-blue-400"
            onClick={() => {
              link('/model')
              setModelType(value.modelType)
            }}
          >
            进入模型
          </Button>
        </div>
      </div>
    )
  })

  return <div className="flex flex-1 gap-2">{cardList}</div>
}

interface AppProps {
  modelTitle: string
  modelDescription: string
  cardInfoList: CardInfo[]
}
export const Feature = ({
  modelTitle,
  modelDescription,
  cardInfoList,
}: AppProps) => {
  const link = useNavigate()
  const setModelType = useMetaStore((state) => state.setModelType)
  const cardList = generateCardList(cardInfoList, link, setModelType)

  return (
    <div className="w-screen">
      <div className="flex h-screen justify-center bg-[url('/item-bg.png')]">
        <div className="relative top-[16vh] flex h-[76vh] w-[88vw]">
          <div
            className="flex w-[30rem] items-center justify-center bg-opacity-50
              bg-[url(/title-bg.png)] bg-[center_top_10rem] bg-no-repeat"
          >
            <div
              className="relative left-[-2vw] top-[-4vh] text-lg text-[#135eb0]"
            >
              <div className="mb-4 text-5xl font-semibold tracking-widest">
                {modelTitle}
              </div>
              <div className="mr-2 self-end py-2">{modelDescription}</div>
            </div>
          </div>
          {cardList}
        </div>
      </div>
    </div>
  )
}

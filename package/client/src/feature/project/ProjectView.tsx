import { Card } from 'antd'
const { Meta } = Card

// const CardListContainer = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
//   grid-gap: 30px;
//   justify-items: center;
//   background: #fff;
//   z-index: 10;
//   margin: 30px 80px;
//   padding: 30px 20px;
//   height: 76vh;
//   width: 100%;
//   overflow: auto;
//   border: 1px solid #bfbfbf;
//   border-radius: 10px;
// `

// const TagsContainer = styled.div`
//   width: 220px;
//   overflow: scroll;
//   white-space: nowrap;
//   ::-webkit-scrollbar {
//     display: none; /* Chrome Safari */
//   }
//   scrollbar-width: none; /* firefox */
//   -ms-overflow-style: none; /* IE 10+ */
// `

export const ProjectView = () => {
  return (
    <div className="relative flex h-full w-full flex-col bg-white">
      <div className="flex h-12 self-center border-0 border-b border-slate-300">
        项目列表
      </div>
      <div className="flex flex-auto bg-white">
        {/* <CardList dataList={data}></CardList> */}
      </div>
    </div>
  )
}

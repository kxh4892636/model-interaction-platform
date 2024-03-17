// export const CardList = ({ dataList }: { dataList: ProjectListData[] }) => {
//   const setViewTag = useViewStore((state) => state.setViewTag)
//   const setProjectKey = useProjectStatusStore((state) => state.setKey)
//   const projectKey = useProjectStatusStore((state) => state.key)
//   const map = useMapStore((state) => state.map)
//   const initAction = useInit()
//   const setModal = useModalStore((state) => state.setModal)
//   const modalTag = useModalStore((state) => state.modalTag)
//   const setModalTag = useModalStore((state) => state.setModalTag)
//   const manualRefresh = useManualRefreshStore((state) => state.manualRefresh)
//   const setLayers = useLayersStore((state) => state.setLayers)

//   const cardList = dataList.map((data) => (
//     <Card
//       style={{ flex: '1 1 0', width: '240px', maxHeight: '310px' }}
//       cover={<img alt="cover" src={data.image} width={210} height={180} />}
//       key={data.key}
//       size={'small'}
//       actions={[
//         <Popconfirm
//           title="删除项目"
//           description="你是否确定删除该项目?"
//           onConfirm={() => {
//             axios
//               .request({
//                 url: serverHost + '/api/project/action',
//                 method: 'post',
//                 data: {
//                   action: 'delete',
//                   id: data.key,
//                 },
//               })
//               .then((res) => {
//                 const result = res.data
//                 if (result.status === 'success') {
//                   message.success('删除项目完成')
//                 } else {
//                   message.error('删除项目失败')
//                 }
//                 manualRefresh()
//               })
//           }}
//           okText="确定删除"
//           cancelText="取消删除"
//         >
//           <Button
//             type="primary"
//             danger
//             style={{
//               marginInlineEnd: 'auto',
//               marginInlineStart: '10px',
//               fontSize: '14px',
//             }}
//           >
//             删除项目
//           </Button>
//         </Popconfirm>,
//         projectKey !== '' ? (
//           <Popconfirm
//             title="加载项目"
//             description="已存在项目, 加载该项目将取消目前一切操作?"
//             onConfirm={async () => {
//               initAction.clearStoreDataExcludeMapAndProject()
//               await axios
//                 .request({
//                   url: serverHost + '/api/project/project',
//                   params: {
//                     action: 'layer',
//                     id: data.key,
//                   },
//                 })
//                 .then((res) => setLayers(res.data.content, 'data'))
//               setProjectKey(data.key)
//               setViewTag(false)
//               map!.setCenter([
//                 Number(data.position[0]),
//                 Number(data.position[1]),
//               ])
//               map!.setZoom(Number(data.position[2]))
//               message.success('加载项目完成')
//             }}
//             okText="确定加载"
//             cancelText="取消加载"
//           >
//             <Button type="primary" style={{ marginLeft: 'auto' }}>
//               加载项目
//             </Button>
//           </Popconfirm>
//         ) : (
//           <Button
//             type="primary"
//             onClick={async () => {
//               initAction.clearStoreDataExcludeMapAndProject()
//               await axios
//                 .request({
//                   url: serverHost + '/api/project/project',
//                   params: {
//                     action: 'layer',
//                     id: data.key,
//                   },
//                 })
//                 .then((res) => setLayers(res.data.content, 'data'))
//               setProjectKey(data.key)
//               setViewTag(false)
//               map!.setCenter([
//                 Number(data.position[0]),
//                 Number(data.position[1]),
//               ])
//               map!.setZoom(Number(data.position[2]))
//               message.success('加载项目完成')
//             }}
//             style={{ marginLeft: 'auto' }}
//           >
//             加载项目
//           </Button>
//         ),
//       ]}
//     >
//       <Meta
//         title={data.title}
//         description={<TagsPanel tags={data.tags}></TagsPanel>}
//       />
//     </Card>
//   ))

//   return (
//     <>
//       {modalTag ? <ProjectInfoModal /> : <></>}
//       <CardListContainer>
//         <Card
//           style={{ width: '240px', maxHeight: '310px' }}
//           cover={
//             <img
//               alt="cover"
//               src={process.env.PUBLIC_URL + '/new_project.png'}
//               width={210}
//               height={180}
//             />
//           }
//           key={'new'}
//           size={'small'}
//           actions={[
//             projectKey !== '' ? (
//               <Popconfirm
//                 title="创建空白项目"
//                 description="已存在项目, 创建该项目将取消目前一切操作?"
//                 onConfirm={() => {
//                   setModal(<ProjectInfoModal />)
//                   setModalTag(true)
//                 }}
//                 okText="确定创建"
//                 cancelText="取消创建"
//               >
//                 <Button id="new" type="primary" style={{ marginLeft: 'auto' }}>
//                   创建空白项目
//                 </Button>
//               </Popconfirm>
//             ) : (
//               <Button
//                 id="new"
//                 type="primary"
//                 onClick={() => {
//                   setModal(<ProjectInfoModal />)
//                   setModalTag(true)
//                 }}
//                 style={{ marginLeft: 'auto' }}
//               >
//                 创建空白项目
//               </Button>
//             ),
//           ]}
//         >
//           <Meta title={'空白项目'} description={<Tag>空白项目</Tag>} />
//         </Card>
//         {cardList}
//       </CardListContainer>
//     </>
//   )
// }

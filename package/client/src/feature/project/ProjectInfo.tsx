// const ProjectInfoModal = () => {
//   const initAction = useInit()
//   const [isLoading, setIsLoading] = useState(false)
//   const [inputValue, setInputValue] = useState('')
//   const setProjectKey = useProjectStatusStore((state) => state.setKey)
//   const map = useMapStore((state) => state.map)
//   const modalTag = useModalStore((state) => state.modalTag)
//   const setModalTag = useModalStore((state) => state.setModalTag)
//   const setModal = useModalStore((state) => state.setModal)

//   return (
//     <Modal
//       title="创建空白项目"
//       cancelText="取消"
//       okText="确认"
//       centered
//       style={{ top: '-10vh' }}
//       confirmLoading={isLoading}
//       open={modalTag}
//       onOk={async () => {
//         if (inputValue === '') {
//           message.error('请输入项目标题')
//           return
//         } else;
//         const result = await axios.request({
//           url: serverHost + '/api/project/action',
//           method: 'post',
//           data: {
//             action: 'create',
//             title: inputValue,
//           },
//         })
//         if (result.data.status === 'success') {
//           setProjectKey(result.data.content)
//           map!.setCenter([116.3916, 39.9079])
//           map!.setZoom(11)
//           initAction.clearStoreDataExcludeMapAndProject()
//           message.success('创建空白项目完成')
//         } else {
//           message.error('创建空白项目失败')
//         }
//         setModalTag(false)
//         setIsLoading(false)
//         setModal(<></>)
//       }}
//       onCancel={() => {
//         setModalTag(false)
//         message.error('创建空白项目失败')
//       }}
//     >
//       <Space direction="vertical" style={{ width: 380 }}>
//         <div>项目标题</div>
//         <Input
//           placeholder="请输入项目标题"
//           onChange={(e) => {
//             setInputValue(e.target.value)
//           }}
//         />
//       </Space>
//     </Modal>
//   )
// }

// const TagsPanel = ({ tags }: { tags: string[] }) => {
//   const tagRef = useRef<HTMLDivElement | null>(null)
//   const intervalRef = useRef<number>(0)
//   const colors = [
//     'magenta',
//     'red',
//     'volcano',
//     'orange',
//     'gold',
//     'lime',
//     'green',
//     'cyan',
//     'blue',
//     'geekblue',
//     'purple',
//   ]

//   const autoScroll = () => {
//     async function sleep(delay: number) {
//       return new Promise((resolve) => setTimeout(resolve, delay))
//     }
//     const scroll = async () => {
//       if (!tagRef.current) return
//       else;
//       if (tagRef.current.scrollWidth <= tagRef.current.clientWidth) return
//       else;
//       if (
//         tagRef.current.scrollLeft + tagRef.current.clientWidth ===
//         tagRef.current.scrollWidth
//       ) {
//         await sleep(500)
//         tagRef.current.scrollLeft = 0
//         cancelAnimationFrame(intervalRef.current)
//       } else if (tagRef.current.scrollLeft === 0) {
//         await sleep(500)
//         tagRef.current.scrollLeft += 1
//         cancelAnimationFrame(intervalRef.current)
//       } else {
//         tagRef.current.scrollLeft += 1
//       }
//       intervalRef.current = requestAnimationFrame(scroll)
//     }

//     if (!tagRef.current) return
//     else;
//     intervalRef.current = requestAnimationFrame(scroll)
//     tagRef.current.onmousemove = () => {
//       cancelAnimationFrame(intervalRef.current)
//     }
//     tagRef.current.onmouseenter = () => {
//       cancelAnimationFrame(intervalRef.current)
//     }
//     tagRef.current.onmouseleave = () => {
//       intervalRef.current = requestAnimationFrame(scroll)
//     }
//   }

//   const element = tags.map((tag, index) => {
//     const random = Math.floor(Math.random() * 10)

//     return (
//       <Tag key={index} color={colors[random]}>
//         {tag}
//       </Tag>
//     )
//   })

//   useEffect(() => {
//     autoScroll()
//     return () => {
//       cancelAnimationFrame(intervalRef.current)
//     }
//   }, [])

//   return tags.length >= 1 ? (
//     <TagsContainer ref={tagRef}>{element}</TagsContainer>
//   ) : (
//     <TagsContainer>
//       <Tag>无标签</Tag>
//     </TagsContainer>
//   )
// }

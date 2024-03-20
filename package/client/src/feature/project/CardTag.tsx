import { Tag } from 'antd'
import { useEffect, useRef } from 'react'

const autoScroll = (
  tagRef: React.MutableRefObject<HTMLDivElement>,
  intervalRef: React.MutableRefObject<number>,
) => {
  async function sleep(delay: number) {
    return new Promise((resolve) => setTimeout(resolve, delay))
  }
  const scroll = async () => {
    if (tagRef.current.scrollWidth <= tagRef.current.clientWidth) return
    if (
      tagRef.current.scrollLeft + tagRef.current.clientWidth ===
      tagRef.current.scrollWidth
    ) {
      await sleep(500)
      tagRef.current.scrollLeft = 0
      cancelAnimationFrame(intervalRef.current)
    } else if (tagRef.current.scrollLeft === 0) {
      await sleep(500)
      tagRef.current.scrollLeft += 1
      cancelAnimationFrame(intervalRef.current)
    } else {
      tagRef.current.scrollLeft += 1
    }
    intervalRef.current = requestAnimationFrame(scroll)
  }

  intervalRef.current = requestAnimationFrame(scroll)
  tagRef.current.onmousemove = () => {
    cancelAnimationFrame(intervalRef.current)
  }
  tagRef.current.onmouseenter = () => {
    cancelAnimationFrame(intervalRef.current)
  }
  tagRef.current.onmouseleave = () => {
    intervalRef.current = requestAnimationFrame(scroll)
  }
}

const generateTags = (tags: string[], colors: string[]) => {
  if (tags.length === 0) {
    return <Tag key={0}>{'无标签'}</Tag>
  }

  const elements = tags.map((tag, index) => {
    const random = Math.floor(Math.random() * 10)
    return (
      <Tag key={index} color={colors[random]}>
        {tag}
      </Tag>
    )
  })
  return elements
}

interface AppProps {
  tags: string[]
}
export const CardTag = ({ tags }: AppProps) => {
  const tagRef = useRef<HTMLDivElement | null>(null)
  const intervalRef = useRef<number>(0)
  const colors = [
    'magenta',
    'red',
    'volcano',
    'orange',
    'gold',
    'lime',
    'green',
    'cyan',
    'blue',
    'geekblue',
    'purple',
  ]
  const element = generateTags(tags, colors)

  useEffect(() => {
    if (!tagRef.current) return
    autoScroll(tagRef as React.MutableRefObject<HTMLDivElement>, intervalRef)
    return () => {
      cancelAnimationFrame(intervalRef.current)
    }
  }, [])

  return (
    <div ref={tagRef} className="w-56 overflow-hidden whitespace-nowrap">
      {element}
    </div>
  )
}

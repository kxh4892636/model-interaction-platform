export const Overview = () => {
  return (
    <div className="flex h-screen bg-[url('/home-bg.png')]">
      <div
        className="absolute right-[4vw] top-[36vh] flex flex-col text-lg
          text-white"
      >
        <div className="mb-5 text-6xl tracking-wide">
          港口水环境与生态动力学精细化模拟平台
        </div>
        <div className="mr-2 self-end py-2">
          面向港口海域水环境与生态演化的精细化模拟及识别系统
        </div>
        <div className="mr-2 self-end">
          实现水沙动力、水环境和生态模型的计算、可视化呈现和数据管理
        </div>
        <div className="mr-2 self-end py-2">
          完成多组分生源物质模拟，典型生物识别精度达到0.8
        </div>
      </div>
    </div>
  )
}

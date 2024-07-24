interface AppProps {
  children: any
}

export const Header = ({ children }: AppProps) => {
  return (
    <div
      className="fixed z-10 h-16 w-screen bg-[#135eb0] p-5 text-xl
        tracking-widest text-white"
    >
      {children}
    </div>
  )
}

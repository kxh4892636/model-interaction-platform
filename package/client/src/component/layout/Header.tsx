interface AppProps {
  children: any
}

export const Header = ({ children }: AppProps) => {
  return (
    <div
      className="fixed z-10 h-16 w-screen bg-[#0f4a8a] p-5 text-xl
        tracking-widest text-white"
    >
      {children}
    </div>
  )
}

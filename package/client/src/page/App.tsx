const App = () => {
  return (
    <button
      className="flex-auto text-red-600 h-screen w-screen text-6xl"
      onClick={async () => {
        const response = await fetch('http://localhost:1234/test')
          .then((res) => res.text())
          .then((value) => {
            return value
          })

        alert(response)
      }}
    >
      Hello, World!
    </button>
  )
}

export default App

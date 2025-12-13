import Navbar from './components/Navbar'

function App() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <div className="p-10 text-white text-center">
        <h1 className="text-4xl font-bold mb-4">Ana İçerik Alanı</h1>
        <p>Burası Navbar'ın altındaki dinamik alan.</p>
      </div>
    </div>
  )
}
export default App
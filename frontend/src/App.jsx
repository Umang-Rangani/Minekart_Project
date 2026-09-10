import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header'

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Header />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

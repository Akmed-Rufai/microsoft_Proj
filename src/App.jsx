import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import searchBar from "./searchBar"
function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" Component={searchBar}></Route>
        </Routes>
      </Router>
  
    </>
  )
}

export default App

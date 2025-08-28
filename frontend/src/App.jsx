import React from "react"
import { Toaster } from "react-hot-toast"
import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
import Navbar from "./Navbar"
function App() {
  return (
    <div>
      <React.Fragment>
        <Router>
          <Navbar/>
          <Routes>
            <Route path="/"/>
          </Routes>
        </Router>
        <Toaster position="bottom-center"/>
      </React.Fragment>
    </div>
  )
}

export default App

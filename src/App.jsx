import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./components/Login"
import Signup from "./components/Signup";
import Home from "./components/Home";
import "./index.css"

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Home" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App

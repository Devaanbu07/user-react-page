import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './login';
import Home from './home';
import UserDetails from './userDetails';  
const App = ()=>{
  return (
    
<Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/users" element={<UserDetails />} />  {/* Add route */}
      </Routes>
    </Router>
  )
}
export default App;
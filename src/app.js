import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Events from './pages/Events';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import SingleEvent from './pages/SingleEvent';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/"> Home </Link>
        <Link to="/login"> Login </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<SingleEvent />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

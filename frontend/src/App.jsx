import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Messages from './pages/Messages';
import Chat from './pages/Chat';
import User from './pages/User';
import RegisterTalent from './pages/RegisterTalent';
import Talent from './pages/Talent';
import VaTal from './pages/VaTal';
import DetailVaTal from './pages/DetailVaTal';
import Status from './pages/Status';
import NotFound from './pages/NotFound';
import NotificationProvider from './components/Notification';

function App() {
  return (
    <Router>
      <NotificationProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/user-profile" element={<User />} />
          <Route path="/join-talent" element={<RegisterTalent />} />
          <Route path="/talent-profile" element={<Talent />} />
          <Route path="/vacancies" element={<VaTal />} />
          <Route path="/talents" element={<VaTal />} />
          <Route path="/vacancies/post/:id" element={<DetailVaTal />} />
          <Route path="/talent/profile/:username" element={<DetailVaTal />} />
          <Route path="/status" element={<Status />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </NotificationProvider>
    </Router>
  )
}

export default App

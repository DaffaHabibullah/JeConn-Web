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
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import NotificationProvider from './components/Notification';
import { ProtectedRoute } from './middleware/checkAuth';

function App() {
  return (
    <Router>
      <NotificationProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/home" element={<ProtectedRoute roleRequired="user"><Home /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute roleRequired="user"><Messages /></ProtectedRoute>} />
          <Route path="/chat/:id" element={<ProtectedRoute roleRequired="user"><Chat /></ProtectedRoute>} />
          <Route path="/user-profile" element={<ProtectedRoute roleRequired="user"><User /></ProtectedRoute>} />
          <Route path="/join-talent" element={<ProtectedRoute roleRequired="user"><RegisterTalent /></ProtectedRoute>} />
          <Route path="/talent-profile" element={<ProtectedRoute roleRequired="user"><Talent /></ProtectedRoute>} />
          <Route path="/vacancies" element={<ProtectedRoute roleRequired="user"><VaTal /></ProtectedRoute>} />
          <Route path="/talents" element={<ProtectedRoute roleRequired="user"><VaTal /></ProtectedRoute>} />
          <Route path="/vacancies/post/:id" element={<ProtectedRoute roleRequired="user"><DetailVaTal /></ProtectedRoute>} />
          <Route path="/talent/profile/:username" element={<ProtectedRoute roleRequired="user"><DetailVaTal /></ProtectedRoute>} />
          <Route path="/status" element={<ProtectedRoute roleRequired="user"><Status /></ProtectedRoute>} />

          <Route path="/admin/*" element={<ProtectedRoute roleRequired="admin"><Admin /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </NotificationProvider>
    </Router>
  )
}

export default App

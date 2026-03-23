// App.jsx  sets up all the routes and wraps pages that need auth protection
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar          from './components/Navbar';
import ProtectedRoute  from './components/ProtectedRoute';
import Landing         from './pages/Landing';
import Register        from './pages/Register';
import Login           from './pages/Login';
import Dashboard       from './pages/Dashboard';
import Profile         from './pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      {/* navbar sits outside Routes so it shows on every page */}
      <Navbar />

      <Routes>
        {/* public pages anyone can visit these */}
        <Route path="/"         element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login"    element={<Login />} />

        {/* protected pages ProtectedRoute kicks you to login if not authenticated */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* catch anything else and send them home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

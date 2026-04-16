// App.jsx  sets up all the routes and wraps pages that need auth protection
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar          from './components/Navbar';
import ProtectedRoute  from './components/ProtectedRoute';
import Landing         from './pages/Landing';
import Register        from './pages/Register';
import Login           from './pages/Login';
import Dashboard       from './pages/Dashboard';
import Profile         from './pages/Profile';
import ProfileSetup    from './pages/ProfileSetup';
import Testimonials    from './pages/Testimonials';
import PriceComparison from './pages/PriceComparison';
import ShoppingCart    from './pages/ShoppingCart';
import Recipes         from './pages/Recipes';
import MealPlanner     from './pages/MealPlanner';

export default function App() {
  return (
    <BrowserRouter>
      {/* navbar sits outside Routes so it shows on every page */}
      <Navbar />

      <Routes>
        {/* public pages anyone can visit these */}
        <Route path="/"                  element={<Landing />} />
        <Route path="/register"          element={<Register />} />
        <Route path="/login"             element={<Login />} />
        <Route path="/testimonials"      element={<Testimonials />} />
        <Route path="/price-comparison"  element={<PriceComparison />} />
        <Route path="/shopping-cart"     element={<ShoppingCart />} />
        <Route path="/meals"             element={<MealPlanner />} />
        <Route path="/recipes"           element={<Recipes />} />

        {/* protected pages ProtectedRoute kicks you to login if not authenticated */}
        <Route path="/dashboard"     element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile"       element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />

        {/* catch anything else and send them home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// wraps any page that needs you to be logged in
// the loading check is important without it you'd get sent redirected to /login
// even when you have a valid token (it takes a moment to verify on page refresh)
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;              // still checking the token
  if (!user)   return <Navigate to="/login" replace />; // not logged in send them to login
  return children;                                      // all good, show the page
}

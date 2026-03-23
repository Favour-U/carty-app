// global auth state  wraps the whole app so any page can access the logged-in user
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true); // true while we check for a saved token on load

  // when the app first loads, check if there's a token saved from a previous session
  // if there is, hit the API to get fresh user data 
  useEffect(() => {
    const savedToken = localStorage.getItem('carty_token');
    if (savedToken) {
      api.get('/users/profile')
        .then((res) => {setUser(res.data);setToken(savedToken);})
        .catch(() => {localStorage.removeItem('carty_token');})// token was probably expired or invalid - clear it out
        .finally(() => setLoading(false));
    } else {
      setLoading(false); // no token, nothing to check
    }
  }, []);

  // called right after a successful register or login
  // stores the token and sets the user so the whole app knows someone is logged in
  const login = (data) => {
    localStorage.setItem('carty_token', data.token);
    setToken(data.token);
    setUser({ _id: data._id, name: data.name, email: data.email });
  };

  // wipe everything - called when user hits logout
  const logout = () => {
    localStorage.removeItem('carty_token');
    setToken(null);
    setUser(null);
  };

  // used by the profile page to sync updated fields back into context without refetching
  const updateUser = (updatedFields) => {
    setUser((prev) => ({ ...prev, ...updatedFields }));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// custom hook so pages just do: const { user } = useAuth()  much cleaner
export function useAuth() {
  return useContext(AuthContext);
}

import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import TopBar from './components/TopBar';
import MainPage from './pages/mainpage';
import SotdPage from './pages/sotd';
import MembersPage from './pages/members';
import ArticlesPage from './pages/articles';
import ArticleDetail from './pages/ArticleDetail';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { useState, useEffect } from 'react';
import { db } from './firebase'; // make sure to import your firebase config
import { doc, getDoc } from 'firebase/firestore';
import ChatPage from './pages/ChatPage';
import GamblingPage from './pages/gambling';
import Clickerpage from './pages/ClickerPage';

function AppContent() {
  const { user, username, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    // Fetch admin and owner status when user changes or when component mounts
    const fetchStatus = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setIsAdmin(data.isAdmin); // Set admin status
          setIsOwner(data.isOwner); // Set owner status
        }
      } else {
        setIsAdmin(false); // Reset isAdmin when user is null
        setIsOwner(false); // Reset isOwner when user is null
      }
    };

    fetchStatus();
  }, [user]); // Re-run the effect when `user` changes

  return (
    <Router>
      <div>
        <TopBar />
        {user ? (
          <>
            <p className="centered">Welcome, {username}!</p>
            {isAdmin && (
              <>
                <p className="centered yellow">Admin Account</p>
                {isOwner && <p className="centered red">Owner Account</p>}
              </>
            )}
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/sotd" element={<SotdPage />} />
              <Route path="/members" element={<MembersPage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/articles/:id" element={<ArticleDetail />} />
              <Route path="*" element={<Navigate to="/" />} />
              <Route path="/ideas" element={<ChatPage />} />
              <Route path="/gambling" element={<GamblingPage />} />
              <Route path="/clicker" element={<Clickerpage />} />
            </Routes>
            <br />
            <br />
            <button onClick={logout} className="centered">
              Logout
            </button>
          </>
        ) : (
          <div className="centered">
            <Routes>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="*" element={<Navigate to="/signin" />} />
            </Routes>
            <button onClick={() => (window.location.href = '/signin')}>
              Sign In
            </button>
            <button onClick={() => (window.location.href = '/signup')}>
              Sign Up
            </button>
          </div>
        )}
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

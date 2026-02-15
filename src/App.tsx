import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import SplashScreen from './components/SplashScreen';
import LandingPage from './pages/LandingPage';
import VerifyPage from './pages/VerifyPage';
import PermissionsPage from './pages/PermissionsPage';
import RegisterPage from './pages/RegisterPage';
import TalkPage from './pages/TalkPage';
import TalkWritePage from './pages/TalkWritePage';
import NearbyPage from './pages/NearbyPage';
import ThemePage from './pages/ThemePage';
import MessagesPage from './pages/MessagesPage';
import ChatPage from './pages/ChatPage';
import MorePage from './pages/MorePage';
import ProfileEditPage from './pages/ProfileEditPage';
import BlockListPage from './pages/BlockListPage';
import UserProfilePage from './pages/UserProfilePage';

const fullScreenPaths = ['/', '/verify', '/permissions', '/register', '/profile/edit', '/block-list', '/talk/write'];

function App() {
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(true);

  const isFullScreen = fullScreenPaths.includes(location.pathname)
    || location.pathname.startsWith('/chat/')
    || location.pathname.startsWith('/user/');

  return (
    <div>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}

      {isFullScreen ? (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/permissions" element={<PermissionsPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/chat/:userId" element={<ChatPage />} />
          <Route path="/profile/edit" element={<ProfileEditPage />} />
          <Route path="/block-list" element={<BlockListPage />} />
          <Route path="/user/:userId" element={<UserProfilePage />} />
          <Route path="/talk/write" element={<TalkWritePage />} />
        </Routes>
      ) : (
        <>
          <Routes>
            <Route path="/talk" element={<TalkPage />} />
            <Route path="/nearby" element={<NearbyPage />} />
            <Route path="/theme" element={<ThemePage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/more" element={<MorePage />} />
            <Route path="*" element={<Navigate to="/nearby" replace />} />
          </Routes>
          <BottomNav />
        </>
      )}
    </div>
  );
}

export default App;

import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import BottomNav from './components/BottomNav';
import SplashScreen from './components/SplashScreen';
import LoadingScreen from './components/LoadingScreen';
import AuthPage from './pages/AuthPage';
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
  const { user, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  // 첫 로드 중 스플래시 + 로딩 화면
  if (showSplash) {
    return <SplashScreen onDone={() => setShowSplash(false)} />;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  // 로그인하지 않으면 AuthPage로
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // 로그인 후 라우팅
  const isFullScreen = fullScreenPaths.includes(location.pathname)
    || location.pathname.startsWith('/chat/')
    || location.pathname.startsWith('/user/');

  return (
    <div>
      {isFullScreen ? (
        <Routes>
          <Route path="/permissions" element={<PermissionsPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/chat/:userId" element={<ChatPage />} />
          <Route path="/profile/edit" element={<ProfileEditPage />} />
          <Route path="/block-list" element={<BlockListPage />} />
          <Route path="/user/:userId" element={<UserProfilePage />} />
          <Route path="/talk/write" element={<TalkWritePage />} />
          <Route path="*" element={<Navigate to="/nearby" replace />} />
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

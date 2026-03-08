import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { supabase } from './lib/supabase';
import { getCurrentPosition } from './utils/geolocation';
import BottomNav from './components/BottomNav';
import SplashScreen from './components/SplashScreen';
import LoadingScreen from './components/LoadingScreen';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import PermissionsPage from './pages/PermissionsPage';
import RegisterPage from './pages/RegisterPage';
import TalkPage from './pages/TalkPage';
import TalkDetailPage from './pages/TalkDetailPage';
import TalkWritePage from './pages/TalkWritePage';
import NearbyPage from './pages/NearbyPage';
import ThemePage from './pages/ThemePage';
import MessagesPage from './pages/MessagesPage';
import ChatPage from './pages/ChatPage';
import MorePage from './pages/MorePage';
import ProfileEditPage from './pages/ProfileEditPage';
import BlockListPage from './pages/BlockListPage';
import UserProfilePage from './pages/UserProfilePage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import KanePurchasePage from './pages/KanePurchasePage';
import KaneHistoryPage from './pages/KaneHistoryPage';
import NotificationSettingsPage from './pages/NotificationSettingsPage';
import SupportPage from './pages/SupportPage';
import BoardDetailPage from './pages/BoardDetailPage';
import BoardListPage from './pages/BoardListPage';
import ProfileViewsPage from './pages/ProfileViewsPage';

const fullScreenPaths = ['/', '/verify', '/permissions', '/register', '/profile/edit', '/block-list', '/talk/write', '/talk/:postId', '/privacy', '/terms', '/kane/purchase', '/kane/history', '/notifications', '/support', '/profile-views'];

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  // 로그인 후 프로필 존재 여부 확인
  useEffect(() => {
    const checkProfile = async () => {
      if (!user) {
        setHasProfile(null);
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      setHasProfile(!!data);
    };

    checkProfile();
  }, [user]);

  // 로그인 시 위치 저장 + 접속 시간 업데이트
  useEffect(() => {
    if (!user || hasProfile !== true) return;
    getCurrentPosition()
      .then(({ latitude, longitude }) => {
        supabase
          .from('profiles')
          .update({
            latitude,
            longitude,
            last_active_at: new Date().toISOString()
          })
          .eq('id', user.id)
          .then(() => {});
      })
      .catch(() => {
        // 위치 권한 없어도 접속 시간은 업데이트
        supabase
          .from('profiles')
          .update({ last_active_at: new Date().toISOString() })
          .eq('id', user.id)
          .then(() => {});
      });
  }, [user, hasProfile]);

  // 주기적 last_active_at 갱신 (5분마다 + 탭 포커스 시)
  useEffect(() => {
    if (!user || hasProfile !== true) return;

    const updateActiveTime = () => {
      supabase
        .from('profiles')
        .update({ last_active_at: new Date().toISOString() })
        .eq('id', user.id)
        .then(() => {});
    };

    const interval = setInterval(updateActiveTime, 5 * 60 * 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateActiveTime();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user?.id, hasProfile]);

  // 프로필 없으면 /permissions → /register로 이동
  useEffect(() => {
    if (user && hasProfile === false && location.pathname !== '/register' && location.pathname !== '/permissions') {
      navigate('/permissions', { replace: true });
    }
  }, [user, hasProfile, location.pathname, navigate]);

  // 첫 로드 중 스플래시 + 로딩 화면
  if (showSplash) {
    return <SplashScreen onDone={() => setShowSplash(false)} />;
  }

  if (loading || (user && hasProfile === null)) {
    return <LoadingScreen />;
  }

  // 로그인하지 않으면 AuthPage로
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // 로그인 후 라우팅
  const isFullScreen = fullScreenPaths.includes(location.pathname)
    || location.pathname.startsWith('/chat/')
    || location.pathname.startsWith('/user/')
    || location.pathname.startsWith('/talk/')
    || location.pathname.startsWith('/board/');

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
          <Route path="/talk/:postId" element={<TalkDetailPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/kane/purchase" element={<KanePurchasePage />} />
          <Route path="/kane/history" element={<KaneHistoryPage />} />
          <Route path="/notifications" element={<NotificationSettingsPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/board/:category" element={<BoardListPage />} />
          <Route path="/board/post/:postId" element={<BoardDetailPage />} />
          <Route path="/profile-views" element={<ProfileViewsPage />} />
          <Route path="*" element={<Navigate to="/talk" replace />} />
        </Routes>
      ) : (
        <>
          <Routes>
            <Route path="/talk" element={<TalkPage />} />
            <Route path="/nearby" element={<NearbyPage />} />
            <Route path="/theme" element={<ThemePage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/more" element={<MorePage />} />
            <Route path="*" element={<Navigate to="/talk" replace />} />
          </Routes>
          <BottomNav />
        </>
      )}
    </div>
  );
}

export default App;

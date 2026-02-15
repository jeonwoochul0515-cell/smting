import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import TalkPage from './pages/TalkPage';
import NearbyPage from './pages/NearbyPage';
import ThemePage from './pages/ThemePage';
import MessagesPage from './pages/MessagesPage';
import ChatPage from './pages/ChatPage';
import MorePage from './pages/MorePage';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}

function App() {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith('/chat/');

  return (
    <div>
      {isChatPage ? (
        <Routes>
          <Route path="/chat/:userId" element={<ChatPage />} />
        </Routes>
      ) : (
        <Layout>
          <Routes>
            <Route path="/talk" element={<TalkPage />} />
            <Route path="/nearby" element={<NearbyPage />} />
            <Route path="/theme" element={<ThemePage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/more" element={<MorePage />} />
            <Route path="*" element={<Navigate to="/nearby" replace />} />
          </Routes>
        </Layout>
      )}
    </div>
  );
}

export default App;

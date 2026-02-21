import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  // 읽지 않은 메시지 수 가져오기
  const fetchUnreadCount = useCallback(async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', user.id)
      .is('read_at', null);

    if (!error && count !== null) {
      setUnreadCount(count);
    }
  }, [user]);

  // 초기 로드 및 사용자 변경 시 카운트 가져오기
  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  // Realtime 구독으로 실시간 업데이트
  useEffect(() => {
    if (!user) return;

    // messages 테이블 변경 감지
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`
        },
        () => {
          // 메시지가 추가, 수정, 삭제될 때마다 카운트 다시 가져오기
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchUnreadCount]);

  return (
    <NotificationContext.Provider value={{ unreadCount, refreshUnreadCount: fetchUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUnreadCount() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useUnreadCount must be used within NotificationProvider');
  }
  return context;
}

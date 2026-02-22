import { supabase } from '../lib/supabase';

/**
 * 쪽지쓰기 시작 함수
 * - 처음 대화 시작 시 3 케인 차감
 * - 이미 대화가 있으면 무료
 */
export async function startChat(
  currentUserId: string,
  targetUserId: string,
  navigate: (path: string) => void
) {
  // 기존 대화 여부 확인
  const { count } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .or(
      `and(sender_id.eq.${currentUserId},recipient_id.eq.${targetUserId}),and(sender_id.eq.${targetUserId},recipient_id.eq.${currentUserId})`
    );

  if ((count || 0) === 0) {
    // 첫 대화 - 케인 확인 및 차감
    const { data: profile } = await supabase
      .from('profiles')
      .select('kane')
      .eq('id', currentUserId)
      .single();

    const currentKane = profile?.kane || 0;
    if (currentKane < 3) {
      alert('케인이 부족합니다.\n새 대화 시작에 3 케인이 필요합니다.\n케인 충전 후 이용해주세요.');
      return;
    }

    await supabase
      .from('profiles')
      .update({ kane: currentKane - 3 })
      .eq('id', currentUserId);

    await supabase
      .from('kane_transactions')
      .insert([{ user_id: currentUserId, amount: -3, reason: 'message_send' }]);
  }

  navigate(`/chat/${targetUserId}`);
}

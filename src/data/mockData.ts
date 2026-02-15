export type Tendency = 'S' | 'M' | 'SW';
export type Gender = '남' | '여';

export interface PlayType {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const playTypes: PlayType[] = [
  { id: 'bondage', name: '본디지', icon: '🔗', description: '구속 플레이' },
  { id: 'rope', name: '로프플레이', icon: '🪢', description: '로프/줄을 이용한 플레이' },
  { id: 'roleplay', name: '롤플레이', icon: '🎭', description: '역할극 플레이' },
  { id: 'spanking', name: '스팽킹', icon: '🖐️', description: '스팽킹 플레이' },
  { id: 'wax', name: '왁스플레이', icon: '🕯️', description: '왁스를 이용한 플레이' },
  { id: 'sensual', name: '센슈얼', icon: '🌹', description: '감각적인 플레이' },
  { id: 'fetish', name: '페티쉬', icon: '👠', description: '페티쉬 플레이' },
  { id: 'discipline', name: '디시플린', icon: '📏', description: '훈육 플레이' },
  { id: 'femdom', name: '펨돔', icon: '👑', description: '여성 지배 플레이' },
  { id: 'maledom', name: '멜돔', icon: '🗡️', description: '남성 지배 플레이' },
  { id: 'petting', name: '페팅', icon: '💋', description: '애무 중심 플레이' },
  { id: 'choking', name: '초킹', icon: '🤚', description: '목 조르기 플레이' },
  { id: 'nipple', name: '니플플레이', icon: '⭕', description: '니플 자극 플레이' },
  { id: 'footworship', name: '풋워십', icon: '🦶', description: '발 페티쉬 플레이' },
  { id: 'cosplay', name: '코스프레', icon: '👗', description: '의상 플레이' },
  { id: 'ageplay', name: '에이지플레이', icon: '🧸', description: '나이 역할극' },
  { id: 'petplay', name: '펫플레이', icon: '🐾', description: '반려동물 역할극' },
  { id: 'sensory', name: '오감차단', icon: '🔇', description: '감각 차단 플레이' },
  { id: 'switching', name: '스위칭', icon: '🔄', description: '역할 전환 플레이' },
  { id: 'cnc', name: 'CNC', icon: '⚡', description: '합의된 비합의 플레이' },
];

export interface User {
  id: number;
  nickname: string;
  age: number;
  gender: Gender;
  tendency: Tendency;
  distance: string;
  intro: string;
  avatar: string;
  tags: string[];
  matchRate: number;
  online: boolean;
}

export interface TalkPost {
  id: number;
  title: string;
  nickname: string;
  age: number;
  distance: string;
  timeAgo: string;
  tendency: Tendency;
  category: string;
}

export interface Message {
  id: number;
  user: User;
  lastMessage: string;
  timeAgo: string;
  unread: boolean;
}

export interface ChatMessage {
  id: number;
  senderId: number;
  text: string;
  time: string;
  isMe: boolean;
}

const avatarColors = ['#8B0000', '#A0153E', '#5C0029', '#2D033B', '#3D0C11', '#6B0848'];

function getAvatar(id: number): string {
  return avatarColors[id % avatarColors.length];
}

export const users: User[] = [
  { id: 1, nickname: '레드문', age: 26, gender: '여', tendency: 'M', distance: '1km', intro: '조용한 분 좋아해요', avatar: getAvatar(1), tags: ['#본디지', '#로프'], matchRate: 92, online: true },
  { id: 2, nickname: '다크나이트', age: 30, gender: '남', tendency: 'S', distance: '2km', intro: '경험 많은 Dom입니다', avatar: getAvatar(2), tags: ['#디시플린', '#롤플레이'], matchRate: 85, online: true },
  { id: 3, nickname: '벨벳', age: 24, gender: '여', tendency: 'SW', distance: '1.5km', intro: '스위치 성향이에요~', avatar: getAvatar(3), tags: ['#페티쉬', '#센슈얼'], matchRate: 78, online: false },
  { id: 4, nickname: '새벽달', age: 28, gender: '여', tendency: 'M', distance: '3km', intro: '진지한 만남 원해요', avatar: getAvatar(4), tags: ['#서브미시브', '#로프'], matchRate: 88, online: true },
  { id: 5, nickname: '그림자', age: 33, gender: '남', tendency: 'S', distance: '2km', intro: '매너 있는 S입니다', avatar: getAvatar(5), tags: ['#디시플린', '#본디지'], matchRate: 95, online: false },
  { id: 6, nickname: '체리블라썸', age: 22, gender: '여', tendency: 'M', distance: '4km', intro: '처음이에요 잘 부탁해요', avatar: getAvatar(6), tags: ['#초보', '#센슈얼'], matchRate: 70, online: true },
  { id: 7, nickname: '블랙홀', age: 35, gender: '남', tendency: 'SW', distance: '1km', intro: '상황에 따라 달라져요', avatar: getAvatar(7), tags: ['#스위치', '#롤플레이'], matchRate: 82, online: true },
  { id: 8, nickname: '실크', age: 27, gender: '여', tendency: 'S', distance: '2.5km', intro: '여S 찾으시는 분~', avatar: getAvatar(8), tags: ['#펨돔', '#디시플린'], matchRate: 90, online: false },
  { id: 9, nickname: '미드나잇', age: 29, gender: '남', tendency: 'M', distance: '5km', intro: '남M입니다 편하게 연락주세요', avatar: getAvatar(9), tags: ['#서브미시브', '#본디지'], matchRate: 75, online: true },
  { id: 10, nickname: '로즈', age: 25, gender: '여', tendency: 'M', distance: '1.5km', intro: '대화부터 시작해요', avatar: getAvatar(10), tags: ['#로프', '#센슈얼'], matchRate: 87, online: true },
  { id: 11, nickname: '카오스', age: 31, gender: '남', tendency: 'S', distance: '3km', intro: '안전하고 즐겁게', avatar: getAvatar(11), tags: ['#본디지', '#디시플린'], matchRate: 83, online: false },
  { id: 12, nickname: '루나', age: 23, gender: '여', tendency: 'SW', distance: '2km', intro: '다양한 경험 원해요', avatar: getAvatar(12), tags: ['#스위치', '#페티쉬'], matchRate: 76, online: true },
];

export const talkPosts: TalkPost[] = [
  { id: 1, title: '오늘 처음 가입했어요', nickname: '체리블라썸', age: 22, distance: '4km', timeAgo: '0초전', tendency: 'M', category: '전체' },
  { id: 2, title: 'S성향 분들 어떻게 시작하셨나요?', nickname: '새벽달', age: 28, distance: '3km', timeAgo: '1분전', tendency: 'M', category: '전체' },
  { id: 3, title: '안전한 플레이 팁 공유합니다', nickname: '다크나이트', age: 30, distance: '2km', timeAgo: '3분전', tendency: 'S', category: '전체' },
  { id: 4, title: '스위치 성향인데 고민이에요', nickname: '벨벳', age: 24, distance: '1.5km', timeAgo: '5분전', tendency: 'SW', category: '전체' },
  { id: 5, title: '주말에 모임 있나요?', nickname: '블랙홀', age: 35, distance: '1km', timeAgo: '10분전', tendency: 'SW', category: '전체' },
  { id: 6, title: '본디지 입문 추천해주세요', nickname: '로즈', age: 25, distance: '1.5km', timeAgo: '15분전', tendency: 'M', category: '전체' },
  { id: 7, title: '여S 여기 있어요~', nickname: '실크', age: 27, distance: '2.5km', timeAgo: '20분전', tendency: 'S', category: '전체' },
  { id: 8, title: '세이프워드 정하는 방법', nickname: '그림자', age: 33, distance: '2km', timeAgo: '30분전', tendency: 'S', category: '전체' },
  { id: 9, title: '처음이라 떨리네요 ㅎㅎ', nickname: '루나', age: 23, distance: '2km', timeAgo: '1시간전', tendency: 'SW', category: '전체' },
  { id: 10, title: '좋은 사람 만나고 싶어요', nickname: '미드나잇', age: 29, distance: '5km', timeAgo: '2시간전', tendency: 'M', category: '전체' },
];

export const messages: Message[] = [
  { id: 1, user: users[0], lastMessage: '안녕하세요~ 프로필 보고 연락드려요', timeAgo: '3분전', unread: true },
  { id: 2, user: users[3], lastMessage: '네 좋아요! 그때 봬요', timeAgo: '1시간전', unread: false },
  { id: 3, user: users[7], lastMessage: '관심사가 비슷하시네요 ㅎㅎ', timeAgo: '3시간전', unread: true },
  { id: 4, user: users[5], lastMessage: '감사합니다~', timeAgo: '1일전', unread: false },
];

export const chatMessages: ChatMessage[] = [
  { id: 1, senderId: 0, text: '안녕하세요! 프로필 보고 연락드려요', time: '오후 6:17', isMe: true },
  { id: 2, senderId: 1, text: '안녕하세요~ 반가워요!', time: '오후 6:18', isMe: false },
  { id: 3, senderId: 0, text: '성향이 잘 맞을 것 같아서요 ㅎㅎ', time: '오후 6:19', isMe: true },
  { id: 4, senderId: 1, text: '저도 프로필 봤어요! 궁합이 높게 나왔더라구요', time: '오후 6:20', isMe: false },
  { id: 5, senderId: 0, text: '혹시 경험은 있으신가요?', time: '오후 6:22', isMe: true },
  { id: 6, senderId: 1, text: '조금 있어요~ 대화하면서 천천히 알아가요', time: '오후 6:24', isMe: false },
];

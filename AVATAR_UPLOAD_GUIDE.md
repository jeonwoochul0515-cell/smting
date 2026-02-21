# 프로필 이미지 업로드 기능 구현 가이드

## 개요
사용자가 프로필 사진을 업로드하고 표시할 수 있는 완전한 기능이 구현되었습니다.

## 구현된 기능

### 1. Database 마이그레이션
**파일:** `/home/user/smting/supabase/migrations/20260221020000_add_avatar_storage.sql`

- `profiles` 테이블에 `avatar_url` 컬럼 추가 (TEXT, nullable)
- Storage 버킷 'avatars' 생성 (public, 5MB 제한)
- Storage RLS 정책:
  - 누구나 아바타 읽기 가능
  - 본인 아바타만 업로드/수정/삭제 가능

**마이그레이션 실행 방법:**
```bash
# Supabase CLI로 마이그레이션 적용
npx supabase db push

# 또는 Supabase Dashboard에서 SQL Editor로 직접 실행
```

### 2. 이미지 업로드 유틸리티
**파일:** `/home/user/smting/src/utils/imageUpload.ts`

**기능:**
- 이미지 파일 검증 (크기: 5MB, 형식: jpg, jpeg, png, webp)
- Supabase Storage에 업로드
- 기존 이미지 자동 삭제
- 공개 URL 반환
- 에러 처리 및 롤백

**주요 함수:**
- `validateImageFile()`: 파일 검증
- `uploadAvatar()`: 이미지 업로드
- `deleteAvatar()`: 이미지 삭제
- `updateAvatarUrl()`: DB 업데이트
- `uploadAndSetAvatar()`: 전체 업로드 프로세스 (추천)
- `removeAvatar()`: 전체 삭제 프로세스

### 3. Avatar 컴포넌트 개선
**파일:** `/home/user/smting/src/components/Avatar.tsx`

**변경사항:**
- `imageUrl?: string | null` prop 추가
- 이미지가 있으면 표시, 없으면 기존 색상 아바타 표시
- 이미지 로딩 실패 시 자동 폴백
- 이미지 로딩 에러 처리

### 4. ProfileEditPage UI 추가
**파일:** `/home/user/smting/src/pages/ProfileEditPage.tsx`

**추가된 UI:**
- 현재 프로필 사진 미리보기 (Avatar 컴포넌트)
- 파일 선택 버튼 (input type="file")
- 업로드 진행 상황 표시 (progress bar)
- 사진 삭제 버튼
- 지원 형식 안내 (JPG, PNG, WEBP • 최대 5MB)

**기능:**
- 파일 선택 시 자동 업로드
- 업로드 진행률 표시
- 기존 이미지 자동 교체
- 삭제 확인 다이얼로그

### 5. 다른 페이지에서 이미지 표시
다음 페이지들이 업데이트되어 프로필 이미지를 표시합니다:

1. **UserProfilePage** (`/home/user/smting/src/pages/UserProfilePage.tsx`)
   - 사용자 프로필에서 아바타 이미지 표시

2. **NearbyPage** (`/home/user/smting/src/pages/NearbyPage.tsx`)
   - 근처/최근 사용자 목록에서 아바타 이미지 표시

3. **ChatPage** (`/home/user/smting/src/pages/ChatPage.tsx`)
   - 채팅 상대방의 아바타 이미지 표시

4. **MorePage** (`/home/user/smting/src/pages/MorePage.tsx`)
   - 내 프로필 카드에서 아바타 이미지 표시
   - DB에서 실시간으로 프로필 데이터 로드

### 6. Icon 컴포넌트 업데이트
**파일:** `/home/user/smting/src/components/Icon.tsx`

- `camera` 아이콘 추가 (파일 선택 버튼에 사용)

## 사용 방법

### 1. 마이그레이션 실행
```bash
# Supabase 프로젝트에 연결
npx supabase link --project-ref <your-project-ref>

# 마이그레이션 적용
npx supabase db push
```

### 2. 프로필 이미지 업로드
1. 앱에서 "더보기" 탭으로 이동
2. 프로필 카드 또는 "프로필 수정" 클릭
3. "프로필 사진" 섹션에서 "사진 선택" 버튼 클릭
4. 이미지 파일 선택 (JPG, PNG, WEBP, 최대 5MB)
5. 자동으로 업로드되고 프로필에 반영됨

### 3. 프로필 이미지 삭제
1. 프로필 수정 페이지에서
2. 프로필 사진 섹션의 "사진 삭제" 버튼 클릭
3. 확인 다이얼로그에서 확인

## 기술 스택

- **Frontend:** React + TypeScript
- **Storage:** Supabase Storage
- **Database:** PostgreSQL (Supabase)
- **Auth:** Supabase Auth (RLS 정책)

## 보안

- Row Level Security (RLS) 정책으로 접근 제어
- 파일 크기 및 형식 검증
- 본인 파일만 업로드/삭제 가능
- Storage 버킷은 public이지만 업로드는 인증된 사용자만 가능

## 에러 처리

- 파일 크기 초과 시: "파일 크기가 너무 큽니다" 메시지
- 지원하지 않는 형식: "지원하지 않는 파일 형식입니다" 메시지
- 업로드 실패 시: 자동 롤백 및 에러 메시지
- 이미지 로딩 실패: 자동으로 색상 아바타로 폴백

## 파일 구조

```
/home/user/smting/
├── supabase/
│   └── migrations/
│       └── 20260221020000_add_avatar_storage.sql  # DB 마이그레이션
├── src/
│   ├── components/
│   │   ├── Avatar.tsx                              # 아바타 컴포넌트 (이미지 지원)
│   │   └── Icon.tsx                                # 아이콘 컴포넌트 (camera 추가)
│   ├── pages/
│   │   ├── ProfileEditPage.tsx                     # 프로필 수정 (업로드 UI)
│   │   ├── UserProfilePage.tsx                     # 사용자 프로필 (이미지 표시)
│   │   ├── NearbyPage.tsx                          # 근처 사용자 (이미지 표시)
│   │   ├── ChatPage.tsx                            # 채팅 (이미지 표시)
│   │   └── MorePage.tsx                            # 더보기 (이미지 표시)
│   └── utils/
│       └── imageUpload.ts                          # 이미지 업로드 유틸리티
└── AVATAR_UPLOAD_GUIDE.md                          # 이 문서
```

## 변경된 파일 목록

1. **새로 생성된 파일:**
   - `supabase/migrations/20260221020000_add_avatar_storage.sql`
   - `src/utils/imageUpload.ts`
   - `AVATAR_UPLOAD_GUIDE.md`

2. **수정된 파일:**
   - `src/components/Avatar.tsx`
   - `src/components/Icon.tsx`
   - `src/pages/ProfileEditPage.tsx`
   - `src/pages/UserProfilePage.tsx`
   - `src/pages/NearbyPage.tsx`
   - `src/pages/ChatPage.tsx`
   - `src/pages/MorePage.tsx`

## 테스트 체크리스트

- [ ] 마이그레이션이 성공적으로 적용되었는가?
- [ ] Storage 버킷 'avatars'가 생성되었는가?
- [ ] 이미지 업로드가 정상 작동하는가?
- [ ] 업로드 진행률이 표시되는가?
- [ ] 이미지가 모든 페이지에서 올바르게 표시되는가?
- [ ] 이미지 삭제가 정상 작동하는가?
- [ ] 파일 크기 제한이 작동하는가?
- [ ] 파일 형식 제한이 작동하는가?
- [ ] 이미지 로딩 실패 시 폴백이 작동하는가?
- [ ] 다른 사용자의 이미지를 수정/삭제할 수 없는가?

## 다음 단계 (선택사항)

1. **이미지 최적화:** 업로드 전 이미지 리사이징 추가
2. **드래그 앤 드롭:** 파일 드래그 앤 드롭 지원
3. **이미지 크롭:** 업로드 전 이미지 크롭 기능
4. **프로그레스:** 실제 업로드 진행률 표시 (현재는 시뮬레이션)
5. **다중 이미지:** 프로필 갤러리 기능

## 문제 해결

### 마이그레이션 실패
```bash
# 마이그레이션 상태 확인
npx supabase db status

# 마이그레이션 재시도
npx supabase db reset
```

### 업로드 실패
1. Supabase Dashboard에서 Storage 버킷 확인
2. RLS 정책이 올바르게 설정되었는지 확인
3. 브라우저 콘솔에서 에러 로그 확인

### 이미지가 표시되지 않음
1. Storage 버킷이 public인지 확인
2. avatar_url 컬럼에 올바른 URL이 저장되었는지 확인
3. 브라우저 네트워크 탭에서 이미지 로딩 확인

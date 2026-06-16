# QLink UAT 시나리오 (개발 서버 환경)

> 앱 소스 + 개발 서버 OpenAPI를 조합한 사용자 인수 테스트(UAT) 시나리오.
> 컬럼: **시나리오 번호 / 시나리오 명 / 성공 기준 / 특이사항**. 성공(정상)·실패(예외) 케이스 모두 포함.

## 테스트 전제 (개발 환경 고정)

| 구분 | 대상 |
|---|---|
| **웹** | https://dev.qlinkapps.com |
| **앱** | iOS Simulator에 빌드한 dev 앱 (EAS dev build) |
| **서버 API** | https://dev.api.qlinkapps.com |

- 모든 시나리오는 위 개발 환경에서 수행. 표의 **특이사항**에 `(웹)` / `(앱)` / `(웹+앱)` 대상과 환경 제약을 표기.
- 인증: 모든 `/api/**`는 JWT 필요. 웹은 쿠키 기반 refresh, 네이티브는 body refreshToken.
- 응답 규약: `{ success, data, error }` 엔벨로프, 커서 페이지네이션 `ScrollResponse { contents, nextCursor, hasNext, isEmpty }`.

### iOS Simulator 제약 (앱 시나리오 사전 인지)
- **푸시 알림 / 디바이스 토큰**: 시뮬레이터는 APNs 미지원 → **검증 불가(실기기 필요)**.
- **카메라 / QR 스캔**: 시뮬레이터 카메라 없음 → **검증 불가(실기기 필요)**.
- **애플 네이티브 로그인**: 시뮬레이터에서 iCloud 로그인 + iOS 13+이면 가능.
- 카카오/구글/네이버 네이티브 SDK 로그인: 시뮬레이터에서 동작.

---

## 1. 인증 / 로그인 (`/api/auth/*`, `/api/devices`)

| 번호 | 시나리오 명 | 성공 기준 | 특이사항 |
|---|---|---|---|
| AUTH-001 | 개발자 로그인 | dev 버튼 → 토큰 저장 → `/home`, 프로필 표시 | (웹+앱) dev 변수 활성 환경만 |
| AUTH-002 | 카카오 로그인 | 인증 → `POST /api/auth/sign{KAKAO}` 200 → 진입 | (웹) `?code=`+state, (앱) SDK accessToken |
| AUTH-003 | 카카오 로그인 실패 | 인증 거부/취소 시 로그인 화면 유지, 에러 토스트 없음 | (웹+앱) |
| AUTH-004 | 구글 로그인 | access/id token → `sign{GOOGLE}` 200 → 진입 | (웹) GIS, (앱) google-signin |
| AUTH-005 | 네이버 로그인 | (웹) SDK 팝업 `#access_token`→sign(NAVER,WEB), (앱) SDK accessToken→sign(NAVER,NATIVE) 200 | (웹) dev.qlinkapps.com redirect 등록됨 → 정상 검증 가능 |
| AUTH-006 | 애플 로그인 | (웹) Apple JS 팝업 id_token→sign(APPLE,WEB), (앱) identityToken→sign(APPLE,NATIVE) 200 | (웹) Services ID `com.qlinkapps.qlink.web`, dev 도메인 등록됨. (앱) 시뮬레이터 iCloud 로그인 필요(iOS13+) |
| AUTH-007 | 로그인 취소/팝업 닫기 | 취소 시 에러없이 로그인 화면 유지 | (웹+앱) cancel 코드 무시 |
| AUTH-008 | 잘못된/만료 소셜 토큰 | 서버 sign 4xx → `success=false` → 인증 미전환 | (웹+앱) |
| AUTH-009 | 웹 토큰 자동 갱신 | accessToken 만료(AUTH_401) → `refresh/web`로 재발급 → 원요청 재시도 성공 | (웹) 쿠키 기반, 단일 refresh |
| AUTH-010 | 네이티브 토큰 갱신 | refreshToken으로 `refresh/native` 재발급 후 재시도 성공 | (앱) body refreshToken |
| AUTH-011 | 갱신 실패 → 로그아웃 | refresh 실패 → `signOut` + "다시 로그인해주세요" 토스트 → 로그인 화면 | (웹+앱) |
| AUTH-012 | 로그아웃 | `DELETE /api/auth/signout` → 토큰 삭제 → 로그인 화면 | (웹+앱) csrf_token 헤더 |
| AUTH-013 | 미인증 접근 차단 | 토큰 없이 보호 라우트 → 로그인 화면/리다이렉트 | (웹+앱) |
| AUTH-014 | 디바이스 토큰 등록 | 로그인 후 Expo 푸시 토큰 → `PUT /api/devices` 200 | (앱) **iOS 시뮬레이터 불가 — 실기기 필요** |

---

## 2. 홈

| 번호 | 시나리오 명 | 성공 기준 | 특이사항 |
|---|---|---|---|
| HOME-001 | 인사/날짜 | `GET /api/users/me` 닉네임 + 시간대 인사 + 날짜 | (웹+앱) |
| HOME-002 | 바로가기 영역 | `links?isFavorite=true` 원형 파비콘 타일 | (웹) 와이드 중심 |
| HOME-003 | 최근 저장 | `links?order=latest` 미리보기, 0건 시 EmptyState | (웹+앱) |
| HOME-004 | 오늘 할 일 | `todos?isCompleted=false` reminder 임박순 | (웹+앱) |
| HOME-005 | 중앙검색-통합 | 검색/Enter → 모달(📌링크+🌐웹) | (웹) 와이드 |
| HOME-006 | 중앙검색-내 링크 | 검색/Enter → 모달(링크 only) | (웹) 와이드 |
| HOME-007 | 중앙검색-웹 | 검색어 有 → 새 탭 `google.com/search?q=`, 빈검색 → 웹모달 | (웹) 와이드 |
| HOME-008 | 모바일 홈 검색 | 헤더 검색 아이콘 → 홈 검색 필드 포커스 | (앱) |

---

## 3. 검색 모달

| 번호 | 시나리오 명 | 성공 기준 | 특이사항 |
|---|---|---|---|
| SEARCH-001 | 탑바/⌘K | 항상 link 모드 모달(500px) | (웹) 와이드 |
| SEARCH-002 | 최근 검색어 | 🕐 목록, 클릭 시 검색 | SecureStore 영속 최대8 |
| SEARCH-003 | 기록 없음 | 👀 "최신 검색어가 없어요" | |
| SEARCH-004 | 링크 결과 | `links?query=` 📌링크 섹션 + 매칭어 하이라이트 | both/link 모드 링크섹션 항상 존재 |
| SEARCH-005 | 링크 0건 | 링크 섹션 내 "최신 검색어가 없어요"(이모지X) | |
| SEARCH-006 | 웹 섹션 | 🌐 "Google에서 검색" 런처 1건, 클릭 시 새 탭 | **실검색결과 아님(placeholder)** |
| SEARCH-007 | 결과 선택 | 모달 닫힘 + 상세/링크 화면 오픈, 최근검색어 추가 | |
| SEARCH-008 | 키보드 네비 | ↑↓ 이동 / Enter 열기 / Esc 닫기, 기본 투명 | (웹) |

---

## 4. 링크 (`/api/links*`)

| 번호 | 시나리오 명 | 성공 기준 | 특이사항 |
|---|---|---|---|
| LINK-001 | 전체 보기 | `links?order=latest` 그리드 + 헤더 아이콘 + 개수 | (웹) 와이드 |
| LINK-002 | 정렬 변경 | latest/earliest/laxico 재조회 | similar 지원 |
| LINK-003 | 즐겨찾기 필터 | `isFavorite=true`만 | |
| LINK-004 | 폴더별 링크 | `folderId=` 필터 | |
| LINK-005 | 무한 스크롤 | `cursor` append, `hasNext=false` 중단 | |
| LINK-006 | 링크 상세 | `GET /api/links/{id}` 요약/태그/메모/할일 | (웹) 오버레이 / (앱) 화면 |
| LINK-007 | 링크 생성 | `POST /api/links` 201 → 상세 이동 | sourceType, tags/todos 배열(빈배열 허용) |
| LINK-008 | URL/필수 누락 | 클라 검증 또는 4xx, 생성 안 됨 | |
| LINK-009 | 링크 수정 | `PUT /api/links/{id}` 200 | |
| LINK-010 | 부분 수정 | `PATCH /api/links/{id}` 200 | |
| LINK-011 | 링크 삭제 | `DELETE /api/links/{id}` 200 → 목록 제거 | |
| LINK-012 | 즐겨찾기 토글 | `PUT .../favorite{isFavorite}` 200 → 바로가기 갱신 | |
| LINK-013 | AI 요약 요청 | `PUT /api/links/ai` → 요약 채워짐 | AI provider 설정 필요 |
| LINK-014 | 없는 링크 상세 | 404 → 에러 화면/토스트 | |
| LINK-015 | QR로 추가 | QR 인식 → URL 프리필 → 생성 | (앱) **시뮬레이터 카메라 없음 — 실기기 필요** |

---

## 5. 바로가기 추가 모달

| 번호 | 시나리오 명 | 성공 기준 | 특이사항 |
|---|---|---|---|
| SHORT-001 | 모달 열기 | 헤더⭐ + 스크롤 리스트 + 중앙 푸터, 최대 80vh | |
| SHORT-002 | 비즐겨찾기 목록 | `links?isFavorite=false&order=latest` 표시 | 클라 `!isFavorite` 재필터 |
| SHORT-003 | 바로가기 고정 | 행 클릭 → `favorite{true}` → 목록 제거 + 바로가기 추가 | |
| SHORT-004 | 추가할 링크 없음 | 🔗 "추가할 링크가 없어요" | |
| SHORT-005 | 리스트 스크롤 | 헤더/푸터 고정, 중앙만 스크롤 | |

---

## 6. 폴더 (`/api/folders*`)

| 번호 | 시나리오 명 | 성공 기준 | 특이사항 |
|---|---|---|---|
| FOLD-001 | 폴더 목록 | `GET /api/folders` 내/공유 분리 + 미분류 | (웹) 사이드바 / (앱) 폴더탭 |
| FOLD-002 | 폴더 생성(일반) | 시트/모달(공유 OFF) → `POST{isShared:false}` 201 | |
| FOLD-003 | 공유 생성(와이드) | "공유폴더 추가" → 토글 ON → `POST{isShared:true}` | (웹) |
| FOLD-004 | 공유 생성(모바일) | "폴더 공유 시작" → 시트 토글 ON | (앱) |
| FOLD-005 | 이름 누락 | "폴더 이름을 입력해주세요" 검증 | |
| FOLD-006 | 한글 입력 안정성 | 이름 한글 빠른 입력 시 버벅임/중복 없음 | EmojiPickerGrid memo 적용 |
| FOLD-007 | 폴더 수정 | `PUT /api/folders/{id}` 200 | |
| FOLD-008 | 폴더 삭제 | `DELETE /api/folders/{id}?onDelete=` 200 | onDelete로 내부 링크 처리 |
| FOLD-009 | 공유 초대 토큰 | `POST /api/folders/{id}{durationDays}` → 초대 생성 | |
| FOLD-010 | 초대 수락 | `PUT .../members{invitation}` 200 → 합류 | 만료/잘못된 토큰 실패 |
| FOLD-011 | 멤버 조회 | `GET .../members` 목록 | |
| FOLD-012 | 멤버 삭제 | `DELETE .../members/{memberId}` 200 | 권한 없으면 4xx |
| FOLD-013 | 헤더 이모지 | 폴더 상세 헤더는 폴더 이모지 그대로 | 아이콘 변환 X |

---

## 7. 할 일 (`/api/todos*`)

| 번호 | 시나리오 명 | 성공 기준 | 특이사항 |
|---|---|---|---|
| TODO-001 | 목록/섹션 | 기간지남/알림예정/알림없음/완료 분류 | (웹) 섹션, 헤더 간격 전체보기와 동일 |
| TODO-002 | 필터 칩 | 칩별 분류 + 개수 정확 | 클라 분류 |
| TODO-003 | 완료 토글 | `PUT .../completed{isCompleted}` 200, 낙관적 갱신 | 링크상세 할일 동기화 |
| TODO-004 | 할일 생성 | `POST /api/todos{linkId,title,reminderAt?}` 201 | 반복 옵션 |
| TODO-005 | 할일 수정 | `PUT /api/todos/{id}` 200 | |
| TODO-006 | 할일 삭제 | `DELETE /api/todos/{id}` 200 | |
| TODO-007 | 서버 필터 | `reminderAt`/`isCompleted` 쿼리 필터 | |
| TODO-008 | 빈 상태 | ✅ "해당하는 할 일이 없어요" | |
| TODO-009 | 토글 실패 롤백 | 실패 시 상태 롤백 + 리포트 | |

---

## 8. 알림 (`/api/notifications*`)

| 번호 | 시나리오 명 | 성공 기준 | 특이사항 |
|---|---|---|---|
| NOTI-001 | 알림 목록 | `GET /api/notifications` 헤더🔔 + 안읽음 수 | |
| NOTI-002 | 안읽음 집계 | `notifications/unread` → 벨/헤더 반영 | |
| NOTI-003 | 읽음 처리 | `PUT .../{id}/read` 200 → 카운트 감소 | |
| NOTI-004 | 알림 없음 | 🔔 "알림이 없어요" | |
| NOTI-005 | 푸시 수신 | 백/포그라운드 푸시 수신 리스너 동작 | (앱) **iOS 시뮬레이터 불가 — 실기기 필요** |

---

## 9. 설정 / 프로필 / AI

| 번호 | 시나리오 명 | 성공 기준 | 특이사항 |
|---|---|---|---|
| SET-001 | 설정 표시 | `me` + `me/settings` 로드, 헤더⚙️ | |
| SET-002 | 프로필 카드 | 이미지 있으면 이미지, 없으면 이모지 | |
| SET-003 | 프로필 수정 | `PUT /api/users/me` 200 → 즉시 반영 | |
| SET-004 | 닉네임 한글 입력 | 빠른 입력 시 버벅임/중복 없음 | memo 적용 |
| SET-005 | 필수값 누락 | "아이디와 닉네임을 모두 입력해주세요" | |
| SET-006 | 아바타 업로드 | `POST /api/images` → avatarUrl 반영 | |
| SET-007 | 아바타 제거 | 이모지 폴백 표시 | |
| SET-008 | 테마/액센트 변경 | 즉시 UI 반영 + `PATCH /me/settings` 동기화 | 로컬 우선 후 서버 hydrate |
| SET-009 | 리마인더 설정 | 토글 → settings PATCH | |
| SET-010 | AI 모델 조회 | `GET /api/ai/providers/models` 목록 | |
| SET-011 | AI 키 등록 | `PUT /api/ai/users/providers` 200, 잘못된 키 4xx | |
| SET-012 | 회원 탈퇴 | `DELETE /api/users/me` 200 → 로그아웃 | 비가역, 확인 다이얼로그 |

---

## 10. 횡단 관심사

| 번호 | 시나리오 명 | 성공 기준 | 특이사항 |
|---|---|---|---|
| SYS-001 | 반응형 전환 | (웹) md 경계 와이드↔모바일, 라우트 유지 | 와이드 `/folders`→`/home` |
| SYS-002 | 사이드바 아이콘 | 홈/전체/할일 아이콘 + active 액센트 | 폴더는 이모지 |
| SYS-003 | 뒤로가기 | history 有 `router.back()`, 無 `/home` | |
| SYS-004 | 단축키 | ⌘K 검색 / N 새 링크 | (웹) 와이드 |
| SYS-005 | 라우트 에러 복구 | 영역 에러 시 "이 영역을 불러오지 못했어요" + 다시시도, 셸 유지 | RouteErrorBoundary |
| SYS-006 | 앱 전역 에러 | 치명 에러 시 "문제가 발생했어요" + 다시시도/홈으로 | AppErrorBoundary |
| SYS-007 | 네트워크 에러 | 5xx/타임아웃 → 토스트, 앱 미크래시 | |
| SYS-008 | 토큰 동시성 | 동시 다중 401 → refresh 1회로 처리 후 일괄 재시도 | 단일 refresh 큐 |
| SYS-009 | 빈 상태 일관성 | 각 목록 0건 시 EmptyState | |

---

## 알려진 제약 (개발 환경 기준)

- **iOS 시뮬레이터 미지원**: 푸시/디바이스 토큰(AUTH-014, NOTI-005), QR 카메라(LINK-015) → 실기기에서 별도 검증.
- **웹 검색(🌐)**: 실제 검색 결과가 아닌 "Google에서 검색" 런처 placeholder.
- **폴더 단건 조회**: 서버에 `GET /api/folders/{id}` 부재 → 목록 조회 결과에서 매핑.
- **AI 요약/키**: 사용자 AI provider 설정 상태에 따라 동작 차이 가능.
- **공유 익스텐션(타앱→내앱 공유)**: 아직 미구현(별도 작업 예정).

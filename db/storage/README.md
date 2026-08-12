# 오브젝트 스토리지 백업 (uploads)

기사 본문/메타 이미지 원본 파일입니다. DB 덤프(`db/production-dump.sql`)의
`/api/storage/objects/uploads/<uuid>` 경로가 이 파일들을 참조합니다.

## 새 앱으로 복원하기
1. 새 앱의 오브젝트 스토리지(App Storage)에 이 파일들을 업로드합니다.
   - 대상 경로: `uploads/<uuid>` (확장자 `.jpg` 제거하고 uuid만 사용)
2. `db/production-dump.sql`을 DB에 실행합니다.
3. 이미지 URL은 상대경로이므로 스토리지 경로만 일치하면 그대로 동작합니다.

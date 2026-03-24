/**
 * user.ts
 * 사용자 관련 TypeScript 타입 정의. User 인터페이스는 전역 인증 상태에서 사용된다.
 */
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

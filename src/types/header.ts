/**
 * 헤더 컴포넌트 관련 타입 정의
 */

export interface UserInfo {
  id: string;
  name: string;
  department: string;
  avatar?: string;
  email?: string;
}

export interface ContactInfo {
  department: string;
  name: string;
  phone: string;
  email?: string;
}

export interface HeaderProps {
  /** 헤더 고정 여부 */
  fixed?: boolean;
  /** 그림자 표시 여부 */
  shadow?: boolean;
  /** 회사명 */
  companyName?: string;
  /** 로고 URL */
  logoUrl?: string;
  /** 로고 크기 */
  logoSize?: 'sm' | 'md' | 'lg';
  /** 현재 사용자 정보 */
  currentUser?: UserInfo | null;
  /** 연락처 목록 */
  contacts?: ContactInfo[];
  /** 원격 지원 URL */
  remoteSupportUrl?: string;
}

export interface HeaderEvents {
  'global-menu-click': [];
  'user-settings': [];
  'user-messages': [];
  'user-logout': [];
  'contact-open': [];
  'contact-close': [];
  'remote-support-click': [url: string];
}
import type { UserInfo, ContactInfo } from '@/types/header';

/**
 * 헤더 컴포넌트 기본값 상수
 */

export const DEFAULT_COMPANY_NAME = 'DONGKUK CM';

export const DEFAULT_REMOTE_SUPPORT_URL = 'http://www.ezh.kr/notice.html';

export const DEFAULT_USER: UserInfo = {
  id: '1',
  name: '장종익',
  department: '냉연생산SM팀',
  email: 'jang@dongkuk.com'
};

export const DEFAULT_CONTACTS: ContactInfo[] = [
  {
    department: 'MES 담당자',
    name: '김철수',
    phone: '010-1234-5678',
    email: 'kim@dongkuk.com'
  },
  {
    department: 'APS 담당자',
    name: '이영희',
    phone: '010-2345-6789',
    email: 'lee@dongkuk.com'
  },
  {
    department: '기타 담당자',
    name: '박민수',
    phone: '010-3456-7890',
    email: 'park@dongkuk.com'
  }
];
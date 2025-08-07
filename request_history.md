# 요청 기록

design.md 파일에 ./docs/ui-requirements.md, ./docs/theme-guide.md 파일의 내용을 빠짐 없이 적용해줘.

------

설계 문서와 ./docs/development-plan.md 파일을 참고해서 다음 단계를 진행하자.

------
테마 시스템 및
 디자인 토큰 구현 작업을 시작합니다. 2.1 다크 테마 CSS 변수 시스템 구축과 2.2 타이포그래피 및 아이콘 시스템 구현을 진행해주세요.

------
테스트 오류 수정을 해. ❯ src/composables/__tests__/useTheme.test.ts:146:34144|       await nextTick()145|146|       expect(currentTheme.value).toBe('light')|                                  ^147|     })148|   })

------지금 어디까지 진
행했는지 tasks.md에 표시 해줘.

------

Implement the task from the markdown document at .kiro/specs/mes-ui-framework/tasks.md:
        
<task title="2.2 타이포그래피 및 아이콘 시스템 구현">

Status: not started

Task details:
- Pretendard 폰트 및 JetBrains Mono 폰트 적용
- 폰트 크기 체계 및 라인 높이 설정
- Lucide React 아이콘 라이브러리 통합 및 MES 특화 아이콘 매핑
- _요구사항: 10.2, 10.3_

</task>

------

.kiro/specs/mes-ui-framework/tasks.md 파일을 보고 '3.1 메인 레이아웃 컴포넌트 생성'을 구현해. basic_rules를 잘 따르도록 해.

------

Sass @import deprecated 경고를 해결해줘. @use와 @forward로 마이그레이션 해야 한다.

------
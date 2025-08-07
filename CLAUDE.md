# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **MES (Manufacturing Execution System) UI Framework** project designed to modernize legacy JSP-based MES systems with a contemporary dark-themed user interface. The project is in the planning and documentation phase, with comprehensive specifications for a multi-page architecture supporting desktop and mobile devices.

## Project Architecture

### Core Architecture Approach
- **Multi-page architecture** with iframe-based tab system for complete page state preservation
- **Dark theme first** design optimized for long-term industrial use
- **Responsive design** with desktop-first approach, supporting tablets and mobile
- **5-level menu tree structure** replacing traditional accordion menus
- **Component-based development** with modern CSS variables and design system

### Key Directories
- `docs/` - Comprehensive project documentation including requirements, development plan, and theme guide
- `README.md` - Project overview and development roadmap (in Korean)
- `MES_UI_Library_Analysis_Report.md` - Technical analysis comparing UI frameworks (React, Vue, etc.)

## Common Development Tasks

### Planning and Documentation
Since this project is currently in planning phase, focus on:
- **Requirements analysis** - Reference `docs/ui-requirements.md` for detailed functional specs
- **Architecture decisions** - Check `docs/development-plan.md` for phased development approach
- **Design consistency** - Follow `docs/theme-guide.md` for theming and component standards

### When implementing components:
1. **Color system**: Use CSS custom properties from the dark theme palette
2. **Typography**: Implement Pretendard/Noto Sans KR font stack with defined size scale
3. **Component hierarchy**: Header → Toolbar → Menu Tree → Tabs → Content Area
4. **State management**: Plan for iframe-based tab state preservation
5. **Responsive breakpoints**: Mobile (≤768px), Tablet (769-1024px), Desktop (1025px+)

## Technical Specifications

### Performance Requirements
- Page loading: ≤3 seconds
- Tab switching: ≤2 seconds  
- Support for 100 concurrent users (1000 total)
- Chrome and Edge browser support (no IE)

### Key Features to Implement
1. **Header Component**: Global menu (≡), company CI, user dropdown, contact list, remote support
2. **Toolbar Component**: Vertical icon bar with 90° rotation hover animation
3. **Menu Tree Component**: 5-level hierarchical structure with expand/collapse
4. **Tab System**: Drag-and-drop reordering, overflow scrolling, fixed home tab
5. **Content Area**: iframe-based page preservation system

### Architecture Decisions Made
- **State preservation**: iframe approach chosen over DOM caching for reliability
- **Theme system**: CSS custom properties with dark/light mode support
- **Icon system**: Lucide React recommended as primary choice
- **Layout**: CSS Grid/Flexbox with component-based structure

### Color Palette (Dark Theme)
```css
--bg-primary: #0f172a      /* Main background */
--bg-secondary: #1e293b    /* Card/panel background */
--text-primary: #f8fafc    /* Primary text */
--primary: #3b82f6         /* Brand blue */
--success: #10b981         /* Success green */
--warning: #f59e0b         /* Warning amber */
--error: #ef4444           /* Error red */
```

## Development Phases
The project follows a 12-week development schedule:
- **Weeks 1-2**: Foundation and layout structure
- **Weeks 3-4**: Header component development  
- **Weeks 5-6**: Toolbar component with animations
- **Weeks 7-8**: Menu tree system with search/favorites
- **Weeks 9-10**: Tab system and content management
- **Weeks 11-12**: Responsive optimization and testing

## Important Constraints
- **No CDN usage** - All assets must be served locally
- **Specific port restrictions** - Port configuration TBD
- **EAI system integration** required for backend connectivity
- **Security compliance** - Internal enterprise environment

## Language and Localization
- Primary language: **Korean** 
- UI text, comments, and documentation are in Korean
- Consider Korean typography requirements (line-height, character spacing)
- Support for Korean input methods in forms

## References
When working on this project, always reference:
- `README.md` for project overview and goals
- `docs/ui-requirements.md` for detailed functional specifications  
- `docs/development-plan.md` for implementation timeline and task breakdown
- `docs/theme-guide.md` for design system guidelines
- `MES_UI_Library_Analysis_Report.md` for technical framework decisions

This is an enterprise MES system targeting manufacturing environments, so prioritize stability, performance, and industrial-grade user experience over experimental features.


## Basic Rules
1. 한국어로 대화 해줘.
2. 단계가 끝날 때 마다 커밋해줘.
3. TDD 방법론으로 진행해줘.
4. 각 task 개발 단계가 시작될때 해당 단계에 대한 설계를 먼저 하고 시작해. 
 - 설계 참고 문서는 기본적으로 ./kiro/specs/mes-ui-framework/design.md 파일이고 추가로 ./docs/basic design/ui-requirements.md, theme-guide.md 파일이야.
 - 파일 생성 위치는 './docs/detail design/' 폴더에 각 Phase 이름으로 저장해줘.  
 - 그리고 이전 단계의 컨셉과 다른지 체크를 해. 
 - 컨셉이 다르면 멈추고 나에게 설명을 하고 결정을 기다려.
5. 개발이 끝난 코드는 리팩토링을 수행해
6. 단계가 끝날 때 설계서와 기능을 비교 해서 잘못된 곳이 없는지 확인하고 알려줘.
7. npm test 를 수행 할 경우 자동으로 키보드 q키를 누르는 것과 동일하게 해서 자동으로 넘어가도록 해줘.
8. 요청은 반듯이 request_history.md 에 요청을 캐리지 리턴으로 구분을 하고 구분선(`
------
`)과 캐리지 리턴을 추가하고 요청을 추가 해줘. 500줄이 넘으면 현재 파일은 request_history[시퀀스 번호].md로 move 하고 새롭게 파일을 시작해줘.
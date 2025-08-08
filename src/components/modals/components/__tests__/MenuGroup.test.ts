import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import MenuGroup from '../MenuGroup.vue'
import type { MenuItem } from '@/types/menu'

describe('MenuGroup', () => {
  const mockMenuItems: MenuItem[] = [
    {
      id: '1',
      title: '생산계획',
      level: 1,
      isFavorite: false,
      children: [
        {
          id: '1-1',
          title: '일일생산계획',
          level: 2,
          isFavorite: false,
          url: '/production/daily-plan'
        },
        {
          id: '1-2',
          title: '주간생산계획',
          level: 2,
          isFavorite: true,
          url: '/production/weekly-plan'
        }
      ]
    },
    {
      id: '2',
      title: '생산실적',
      level: 1,
      isFavorite: false,
      url: '/production/result'
    }
  ]

  const defaultProps = {
    title: '생산관리',
    items: mockMenuItems,
    expanded: true,
    searchQuery: '',
    favorites: new Set(['1-2'])
  }

  let wrapper: any

  beforeEach(() => {
    wrapper = mount(MenuGroup, {
      props: defaultProps
    })
  })

  describe('렌더링', () => {
    it('그룹 제목이 올바르게 표시되어야 한다', () => {
      expect(wrapper.find('.group-title').text()).toBe('생산관리')
    })

    it('확장 상태일 때 chevron-up 아이콘이 표시되어야 한다', () => {
      expect(wrapper.find('.expand-icon').classes()).toContain('expanded')
    })

    it('축소 상태일 때 chevron-down 아이콘이 표시되어야 한다', async () => {
      await wrapper.setProps({ expanded: false })
      expect(wrapper.find('.expand-icon').classes()).not.toContain('expanded')
    })

    it('확장 상태일 때 메뉴 아이템들이 표시되어야 한다', () => {
      expect(wrapper.find('.group-content').classes()).toContain('expanded')
      expect(wrapper.findAll('.menu-item').length).toBeGreaterThan(0)
    })

    it('축소 상태일 때 메뉴 아이템들이 숨겨져야 한다', async () => {
      await wrapper.setProps({ expanded: false })
      expect(wrapper.find('.group-content').classes()).toContain('collapsed')
    })
  })

  describe('인터랙션', () => {
    it('그룹 헤더 클릭 시 toggle 이벤트가 발생해야 한다', async () => {
      await wrapper.find('.group-header').trigger('click')
      expect(wrapper.emitted('toggle')).toBeTruthy()
    })

    it('메뉴 아이템 클릭 시 menu-select 이벤트가 발생해야 한다', async () => {
      const menuItem = wrapper.find('[data-testid="menu-item-2"]')
      await menuItem.trigger('click')
      
      expect(wrapper.emitted('menu-select')).toBeTruthy()
      expect(wrapper.emitted('menu-select')[0][0]).toEqual(mockMenuItems[1])
    })

    it('즐겨찾기 버튼 클릭 시 favorite-toggle 이벤트가 발생해야 한다', async () => {
      const favoriteBtn = wrapper.find('[data-testid="favorite-btn-1"]')
      await favoriteBtn.trigger('click')
      
      expect(wrapper.emitted('favorite-toggle')).toBeTruthy()
      expect(wrapper.emitted('favorite-toggle')[0][0]).toBe('1')
    })
  })

  describe('검색 기능', () => {
    it('검색어와 일치하는 메뉴만 표시되어야 한다', async () => {
      await wrapper.setProps({ searchQuery: '일일' })
      
      const visibleItems = wrapper.findAll('.menu-item')
      expect(visibleItems.length).toBeGreaterThan(0)
      // 검색어가 포함된 메뉴가 있는지 확인
      const hasMatchingItem = visibleItems.some(item => 
        item.text().includes('일일생산계획')
      )
      expect(hasMatchingItem).toBe(true)
    })

    it('검색어가 없을 때 모든 메뉴가 표시되어야 한다', () => {
      const visibleItems = wrapper.findAll('.menu-item')
      expect(visibleItems.length).toBeGreaterThan(0)
    })
  })

  describe('즐겨찾기 기능', () => {
    it('즐겨찾기된 메뉴에 별표 아이콘이 표시되어야 한다', () => {
      const favoriteItem = wrapper.find('[data-testid="menu-item-1-2"]')
      expect(favoriteItem.find('.favorite-icon').classes()).toContain('active')
    })

    it('즐겨찾기되지 않은 메뉴에 빈 별표 아이콘이 표시되어야 한다', () => {
      const normalItem = wrapper.find('[data-testid="menu-item-1"]')
      expect(normalItem.find('.favorite-icon').classes()).not.toContain('active')
    })
  })

  describe('접근성', () => {
    it('그룹 헤더에 적절한 ARIA 속성이 있어야 한다', () => {
      const header = wrapper.find('.group-header')
      expect(header.attributes('aria-expanded')).toBe('true')
      expect(header.attributes('role')).toBe('button')
    })

    it('키보드 네비게이션이 지원되어야 한다', async () => {
      const header = wrapper.find('.group-header')
      await header.trigger('keydown.enter')
      expect(wrapper.emitted('toggle')).toBeTruthy()
      
      await header.trigger('keydown.space')
      expect(wrapper.emitted('toggle')).toHaveLength(2)
    })
  })

  describe('애니메이션', () => {
    it('확장/축소 시 적절한 CSS 클래스가 적용되어야 한다', async () => {
      const content = wrapper.find('.group-content')
      expect(content.classes()).toContain('expanded')
      
      await wrapper.setProps({ expanded: false })
      expect(content.classes()).toContain('collapsed')
    })

    it('아이콘 회전 애니메이션 클래스가 적용되어야 한다', async () => {
      const icon = wrapper.find('.expand-icon')
      expect(icon.classes()).toContain('expanded')
      
      await wrapper.setProps({ expanded: false })
      expect(icon.classes()).not.toContain('expanded')
    })
  })
})
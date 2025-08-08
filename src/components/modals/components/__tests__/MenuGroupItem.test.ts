import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import MenuGroupItem from '../MenuGroupItem.vue'
import type { MenuItem } from '@/types/menu'

describe('MenuGroupItem', () => {
  const mockMenuItem: MenuItem = {
    id: 'test-item',
    title: '테스트 메뉴',
    level: 1,
    isFavorite: false,
    url: '/test-menu',
    icon: 'pi pi-test',
    children: [
      {
        id: 'test-child',
        title: '자식 메뉴',
        level: 2,
        isFavorite: false,
        url: '/test-child'
      }
    ]
  }

  const defaultProps = {
    item: mockMenuItem,
    searchQuery: '',
    favorites: new Set<string>(),
    level: 0
  }

  let wrapper: any

  beforeEach(() => {
    wrapper = mount(MenuGroupItem, {
      props: defaultProps
    })
  })

  describe('렌더링', () => {
    it('메뉴 제목이 올바르게 표시되어야 한다', () => {
      expect(wrapper.find('.title-text').text()).toBe('테스트 메뉴')
    })

    it('자식이 있는 메뉴에 확장 아이콘이 표시되어야 한다', () => {
      expect(wrapper.find('.expand-icon').exists()).toBe(true)
    })

    it('자식이 없는 메뉴에 확장 아이콘이 표시되지 않아야 한다', async () => {
      const leafItem = { ...mockMenuItem, children: undefined }
      await wrapper.setProps({ item: leafItem })
      
      expect(wrapper.find('.expand-placeholder').exists()).toBe(true)
      expect(wrapper.find('.expand-icon').exists()).toBe(false)
    })

    it('메뉴 아이콘이 표시되어야 한다', () => {
      expect(wrapper.find('.menu-icon i').classes()).toContain('pi-test')
    })

    it('즐겨찾기 버튼이 표시되어야 한다', () => {
      expect(wrapper.find('.favorite-btn').exists()).toBe(true)
    })
  })

  describe('인터랙션', () => {
    it('최종 메뉴 클릭 시 menu-select 이벤트가 발생해야 한다', async () => {
      const leafItem = { ...mockMenuItem, children: undefined }
      await wrapper.setProps({ item: leafItem })
      
      await wrapper.find('.menu-item').trigger('click')
      
      expect(wrapper.emitted('menu-select')).toBeTruthy()
      expect(wrapper.emitted('menu-select')[0][0]).toEqual(leafItem)
    })

    it('자식이 있는 메뉴 클릭 시 확장/축소가 토글되어야 한다', async () => {
      const initialExpanded = wrapper.vm.isExpanded
      
      await wrapper.find('.menu-item').trigger('click')
      
      expect(wrapper.vm.isExpanded).toBe(!initialExpanded)
    })

    it('즐겨찾기 버튼 클릭 시 favorite-toggle 이벤트가 발생해야 한다', async () => {
      await wrapper.find('.favorite-btn').trigger('click')
      
      expect(wrapper.emitted('favorite-toggle')).toBeTruthy()
      expect(wrapper.emitted('favorite-toggle')[0][0]).toBe('test-item')
    })
  })

  describe('검색 하이라이팅', () => {
    it('검색어가 있을 때 하이라이팅이 적용되어야 한다', async () => {
      await wrapper.setProps({ searchQuery: '테스트' })
      
      const titleElement = wrapper.find('.title-text')
      expect(titleElement.html()).toContain('<mark class="search-highlight">테스트</mark>')
    })

    it('검색어가 없을 때 하이라이팅이 적용되지 않아야 한다', () => {
      const titleElement = wrapper.find('.title-text')
      expect(titleElement.html()).not.toContain('<mark')
    })
  })

  describe('즐겨찾기 상태', () => {
    it('즐겨찾기된 메뉴에 활성 클래스가 적용되어야 한다', async () => {
      await wrapper.setProps({ favorites: new Set(['test-item']) })
      
      expect(wrapper.find('.favorite-icon').classes()).toContain('active')
    })

    it('즐겨찾기되지 않은 메뉴에 활성 클래스가 적용되지 않아야 한다', () => {
      expect(wrapper.find('.favorite-icon').classes()).not.toContain('active')
    })
  })

  describe('들여쓰기', () => {
    it('레벨에 따른 들여쓰기가 적용되어야 한다', async () => {
      await wrapper.setProps({ level: 2 })
      
      const indent = wrapper.find('.indent')
      expect(indent.attributes('style')).toContain('width: 32px')
    })
  })

  describe('자식 메뉴', () => {
    it('확장 상태일 때 자식 메뉴가 표시되어야 한다', async () => {
      // 기본적으로 확장 상태
      expect(wrapper.find('.children-container').exists()).toBe(true)
    })

    it('축소 상태일 때 자식 메뉴가 숨겨져야 한다', async () => {
      // 메뉴 클릭하여 축소
      await wrapper.find('.menu-item').trigger('click')
      
      expect(wrapper.find('.children-container').exists()).toBe(false)
    })
  })
})
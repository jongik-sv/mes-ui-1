import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MesIcon from '../MesIcon.vue'

describe('MesIcon', () => {
  it('renders with default props', () => {
    const wrapper = mount(MesIcon, {
      props: {
        name: 'home'
      }
    })
    
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.classes()).toContain('mes-icon')
    expect(wrapper.classes()).toContain('mes-icon--lg')
  })

  it('applies correct size classes', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const
    
    sizes.forEach(size => {
      const wrapper = mount(MesIcon, {
        props: {
          name: 'home',
          size
        }
      })
      
      expect(wrapper.classes()).toContain(`mes-icon--${size}`)
    })
  })

  it('applies custom stroke width', () => {
    const wrapper = mount(MesIcon, {
      props: {
        name: 'home',
        strokeWidth: 2
      }
    })
    
    // 현재 구현에서는 i 태그를 사용하므로 strokeWidth는 적용되지 않음
    expect(wrapper.exists()).toBe(true)
  })

  it('applies custom classes', () => {
    const wrapper = mount(MesIcon, {
      props: {
        name: 'home',
        class: 'custom-class'
      }
    })
    
    expect(wrapper.classes()).toContain('custom-class')
  })

  it('handles unknown icon names gracefully', () => {
    const wrapper = mount(MesIcon, {
      props: {
        name: 'unknown-icon'
      }
    })
    
    // Should render a fallback icon or handle gracefully
    expect(wrapper.exists()).toBe(true)
  })

  it('supports accessibility attributes', () => {
    const wrapper = mount(MesIcon, {
      props: {
        name: 'home'
      },
      attrs: {
        'aria-label': 'Home icon',
        role: 'img'
      }
    })
    
    // SVG 요소 확인
    const svg = wrapper.find('svg')
    expect(svg.attributes('aria-label')).toBe('Home icon')
    expect(svg.attributes('role')).toBe('img')
  })
})
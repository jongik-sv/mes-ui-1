import { describe, it, expect } from 'vitest'
import { useIcons } from '../useIcons'

describe('useIcons', () => {
  it('returns icon mapping functions', () => {
    const { getIcon, getBusinessIcon, getNavigationIcon, getActionIcon, getStatusIcon } = useIcons()
    
    expect(typeof getIcon).toBe('function')
    expect(typeof getBusinessIcon).toBe('function')
    expect(typeof getNavigationIcon).toBe('function')
    expect(typeof getActionIcon).toBe('function')
    expect(typeof getStatusIcon).toBe('function')
  })

  it('maps business icons correctly', () => {
    const { getBusinessIcon } = useIcons()
    
    expect(getBusinessIcon('home')).toBe('Home')
    expect(getBusinessIcon('production')).toBe('Factory')
    expect(getBusinessIcon('quality')).toBe('ShieldCheck')
    expect(getBusinessIcon('equipment')).toBe('Settings')
    expect(getBusinessIcon('inventory')).toBe('Package')
  })

  it('maps navigation icons correctly', () => {
    const { getNavigationIcon } = useIcons()
    
    expect(getNavigationIcon('menu')).toBe('Menu')
    expect(getNavigationIcon('search')).toBe('Search')
    expect(getNavigationIcon('expand')).toBe('ChevronDown')
    expect(getNavigationIcon('close')).toBe('X')
  })

  it('maps action icons correctly', () => {
    const { getActionIcon } = useIcons()
    
    expect(getActionIcon('add')).toBe('Plus')
    expect(getActionIcon('edit')).toBe('Pencil')
    expect(getActionIcon('delete')).toBe('Trash2')
    expect(getActionIcon('save')).toBe('Save')
  })

  it('maps status icons correctly', () => {
    const { getStatusIcon } = useIcons()
    
    expect(getStatusIcon('success')).toBe('CheckCircle')
    expect(getStatusIcon('warning')).toBe('AlertTriangle')
    expect(getStatusIcon('error')).toBe('XCircle')
    expect(getStatusIcon('info')).toBe('Info')
  })

  it('returns fallback for unknown icons', () => {
    const { getIcon } = useIcons()
    
    expect(getIcon('unknown-icon')).toBe('HelpCircle')
  })

  it('provides icon search functionality', () => {
    const { searchIcons } = useIcons()
    
    const results = searchIcons('home')
    expect(results).toContain('home')
    
    const productionResults = searchIcons('prod')
    expect(productionResults).toContain('production')
  })

  it('lists all available icons', () => {
    const { getAllIcons } = useIcons()
    
    const allIcons = getAllIcons()
    expect(allIcons).toContain('home')
    expect(allIcons).toContain('menu')
    expect(allIcons).toContain('add')
    expect(allIcons).toContain('success')
    expect(allIcons.length).toBeGreaterThan(0)
  })
})
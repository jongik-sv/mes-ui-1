export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export type BusinessIconName = 
  | 'home'
  | 'production'
  | 'quality'
  | 'equipment'
  | 'inventory'
  | 'planning'
  | 'reporting'
  | 'maintenance'
  | 'logistics'

export type NavigationIconName =
  | 'menu'
  | 'search'
  | 'expand'
  | 'collapse'
  | 'close'
  | 'back'
  | 'forward'
  | 'refresh'

export type ActionIconName =
  | 'add'
  | 'edit'
  | 'delete'
  | 'save'
  | 'copy'
  | 'download'
  | 'upload'
  | 'print'

export type StatusIconName =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'loading'
  | 'online'
  | 'offline'

export type MesIconName = 
  | BusinessIconName 
  | NavigationIconName 
  | ActionIconName 
  | StatusIconName

export interface IconMapping {
  [key: string]: string
}
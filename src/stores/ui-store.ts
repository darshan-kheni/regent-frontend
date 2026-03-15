import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface UIState {
  sidebarCollapsed: boolean
  mobileDrawerOpen: boolean
  globalSearchQuery: string

  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setMobileDrawerOpen: (open: boolean) => void
  setGlobalSearchQuery: (query: string) => void
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      sidebarCollapsed: false,
      mobileDrawerOpen: false,
      globalSearchQuery: '',

      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setMobileDrawerOpen: (open) => set({ mobileDrawerOpen: open }),
      setGlobalSearchQuery: (query) => set({ globalSearchQuery: query }),
    }),
    { name: 'ui-store' }
  )
)

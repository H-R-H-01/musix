import { create } from 'zustand'

// Mock state for now
export const useAuthStore = create((set) => ({
  user: {
    id: '1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    role: 'user', // 'user' | 'admin'
    avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&background=random',
  },
  setUser: (user) => set({ user }),
  toggleRole: () => set((state) => ({
    user: {
      ...state.user,
      role: state.user.role === 'admin' ? 'user' : 'admin',
      name: state.user.role === 'admin' ? 'Jane Doe (User)' : 'Admin User'
    }
  }))
}))
